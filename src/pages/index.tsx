import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useDynamicContext,
  useUserUpdateRequest,
} from '@dynamic-labs/sdk-react-core';
import { GameBoard } from '../components/GameBoard';
import { equationToMap, getRandInt } from '../utils';
import type { Metadata } from '../types';

// TODO: Complete the board generation logic
const validBoards = [
  { answer: 78, board: [119, '-', 41] },
  { answer: 12, board: [21, '/', 7, '+', 9] },
  { answer: 17, board: [90, '/', 9, '+', 7] },
  { answer: 21, board: [18, '+', 6, '-', 3] },
  { answer: 39, board: [24, '*', 2, '-', 9] },
  { answer: 65, board: [112, '-', 47] },
  { answer: 72, board: [27, '*', 3, '-', 9] },
  { answer: 32, board: [28, '-', 3, '+', 7] },
  { answer: 27, board: [95, '/', 5, '+', 8] },
  { answer: 73, board: [132, '-', 59] },
  { answer: 40, board: [32, '+', 4, '+', 4], reversed: [4, '+', 4, '+', 32] },
];

export function Game() {
  const props = useRef<React.ComponentProps<typeof GameBoard>>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useDynamicContext();
  const { updateUser } = useUserUpdateRequest();

  const onGameOver = useCallback(
    (won: boolean) => {
      if (!props.current) return;

      const currentDate = new Date().toISOString().slice(0, 10);
      const history = (user?.metadata as Metadata)?.history ?? [];

      const updatedEntry = {
        date: currentDate,
        won,
        answer: props.current.answer,
        map: props.current.map,
        reversed: props.current.reversed,
      };

      const updatedHistory = structuredClone(history);
      updatedHistory[0] = updatedEntry;

      updateUser({
        metadata: {
          history: updatedHistory,
        },
      });
    },
    [user, props, updateUser]
  );

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const history = (user?.metadata as Metadata)?.history ?? [];

    const game = history.find((entry) => entry.date === currentDate);
    if (game) {
      props.current = {
        answer: game.answer,
        map: game.map,
        reversed: game.reversed,
        onGameOver,
      };
      setIsLoading(false);
    } else {
      const randomBoard = validBoards[getRandInt(validBoards.length)];
      const map = equationToMap(randomBoard.board);
      const answer = randomBoard.answer;
      const reversed = randomBoard.reversed;

      const newHistoryEntry = {
        date: currentDate,
        answer,
        map,
        reversed,
      };

      props.current = {
        answer,
        map,
        reversed,
        onGameOver,
      };

      updateUser({
        metadata: {
          history: [newHistoryEntry, ...history],
        },
      }).then(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !isLoading && props.current && <GameBoard {...props.current} />;
}
