import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { useGame } from '../hooks/game';
import { calculateTotal, mapToBoard, tilesToTokens } from '../utils';

const keyArray = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  '/',
  '*',
  '+',
  '-',
] as const;

type Key = (typeof keyArray)[number];

const keys = new Set(keyArray);

const colorMap = {
  green: 'bg-green-500 border-green-500 text-white',
  amber: 'bg-amber-400 border-amber-400 text-white',
  gray: 'bg-gray-500 border-gray-500 text-white',
};

type Color = keyof typeof colorMap;

function getClassMap() {
  return new Map<Key, string>([
    ['1', ''],
    ['2', ''],
    ['3', ''],
    ['4', ''],
    ['5', ''],
    ['6', ''],
    ['7', ''],
    ['8', ''],
    ['9', ''],
    ['0', ''],
    ['+', ''],
    ['-', ''],
    ['*', ''],
    ['/', ''],
  ]);
}

interface Options {
  answer: number;
  map: Record<string, number[]>;
  reversed?: (string | number)[];
}

export function GameBoard(options: Options) {
  const { answer, map, reversed } = options;
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [keyMap, setKeyMap] = useState(getClassMap);

  const game1 = useGame();
  const game2 = useGame();
  const game3 = useGame();
  const game4 = useGame();
  const game5 = useGame();
  const game6 = useGame();
  const games = [game1, game2, game3, game4, game5, game6];

  const currentGame = games[currentIndex];

  const onSubmit = useCallback(() => {
    if (currentGame.tiles.length !== 6) {
      return toast.error('Not enough numbers');
    }

    // check total
    const total = calculateTotal(currentGame.tiles);
    if (total !== answer) {
      toast.error(
        `Every guess must equal ${answer}... Did you forget your order of operations?`
      );
    } else {
      const board = tilesToTokens(currentGame.tiles);
      const updatedTiles =
        reversed && board.every((token, i) => token === reversed[i])
          ? board.toReversed().map(String).join('').split('')
          : currentGame.tiles;

      currentGame.setTiles(updatedTiles);
      currentGame.setIsComplete(true);

      setKeyMap((prev) => {
        const newMap = new Map(prev);
        updatedTiles.forEach((tile, i) => {
          const key = tile as Key;

          const currentColor = newMap.get(key) ?? '';
          if (map[key]?.includes(i)) {
            newMap.set(key, 'green');
          } else if (map[key] && currentColor !== 'green') {
            newMap.set(key, 'amber');
          } else if (currentColor === '') {
            newMap.set(key, 'gray');
          }
        });
        return newMap;
      });
      if (mapToBoard(map).every((tile, i) => tile === updatedTiles[i])) {
        setIsGameOver(true);
        setIsGameWon(true);
        toast.success('You found the hidden calculation!');
      } else if (currentIndex === 5) {
        setIsGameOver(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  }, [answer, currentGame, reversed, currentIndex, map]);

  useEffect(() => {
    function onKeyUp(event: KeyboardEvent) {
      if (isGameOver) return;

      if (keys.has(event.key as Key)) {
        currentGame.setTile(event.key);
      }
      if (['Backspace', 'Delete'].includes(event.key)) {
        currentGame.onDelete();
      }
      if (event.key === 'Enter') {
        onSubmit();
      }
    }

    document.addEventListener('keyup', onKeyUp);

    return () => document.removeEventListener('keyup', onKeyUp);
  }, [currentGame, onSubmit, isGameOver]);

  return (
    <div className="mx-auto w-96 max-w-full mt-4">
      <p className="text-center mb-2">
        Find the hidden calculation{' '}
        <span className="bg-yellow-300 py-1 rounded-sm">
          that equals {answer}
        </span>
      </p>
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: 6 }, (_, i) =>
          Array.from({ length: 6 }, (_, j) => {
            const val = games[i].tiles[j];

            let color: string | undefined = undefined;

            if (currentIndex > i || isGameOver && val !== undefined) {
              if (map[val]?.includes(j)) {
                color = 'bg-green-500 border-green-500 text-white';
              } else if (map[val]) {
                color = 'bg-amber-400 border-amber-400 text-white';
              } else {
                color = 'bg-gray-500 border-gray-500 text-white';
              }
            }

            return (
              <div
                key={`${i}-${j}`}
                className={twMerge(
                  'border-2 border-gray-300 bg-white font-bold h-10 flex items-center justify-center rounded-sm bg',
                  color
                )}
              >
                {val}
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 space-y-2 mt-4">
        <div className="grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }, (_, i) => {
            const color = keyMap.get(i.toString() as Key);

            return (
              <button
                key={i}
                className={twMerge(
                  'bg-slate-200 hover:bg-slate-300 h-10 flex items-center justify-center rounded-sm text-sm font-bold',
                  color && colorMap[color as Color]
                )}
                onClick={() => currentGame.setTile(i.toString())}
                disabled={isGameOver}
              >
                {i}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-8 gap-1">
          <button
            className="bg-slate-200 hover:bg-slate-300 h-10 flex items-center justify-center rounded-sm col-span-2 font-bold"
            onClick={onSubmit}
            disabled={isGameOver}
          >
            Enter
          </button>
          {['+', '-', '*', '/'].map((op) => {
            const color = keyMap.get(op as Key);

            return (
              <button
                key={op}
                className={twMerge(
                  'bg-slate-200 hover:bg-slate-300 h-10 flex items-center justify-center rounded-sm font-bold',
                  color && colorMap[color as Color]
                )}
                onClick={() => currentGame.setTile(op)}
                disabled={isGameOver}
              >
                {op}
              </button>
            );
          })}
          <button
            className="bg-slate-200 hover:bg-slate-300 h-10 flex items-center justify-center rounded-sm col-span-2 font-bold"
            onClick={currentGame.onDelete}
            disabled={isGameOver}
          >
            Delete
          </button>
        </div>
      </div>
      {isGameOver && (
        <div className="text-center mt-4 font-bold">
          <p className="text-lg">Game Over</p>
          {isGameWon && (
            <p className="mt-3 text-2xl text-green-500">
              Congratulations! You did it.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
