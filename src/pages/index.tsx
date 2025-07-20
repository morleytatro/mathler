import { GameBoard } from '../components/GameBoard';

// 4 + 4 + 32 = 40

export function Game() {
  return (
    <GameBoard
      answer={40}
      map={{ 4: [0, 2], 3: [4], 2: [5], '+': [1, 3] }}
      reversed={[32, '+', 4, '+', 4]}
    />
  );
}
