import { useState } from 'react';

/**
 * Basic hook for managing game state.
 */

export function useGame(size = 6) {
  const [isComplete, setIsComplete] = useState(false);
  const [tiles, setTiles] = useState<string[]>([]);

  function setTile(val: string) {
    setTiles((prev) => (prev.length === size ? prev : [...prev, val]));
  }

  function onDelete() {
    setTiles((prev) => {
      // edge case: if no tiles, do nothing
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }

  return {
    onDelete,
    setTile,
    tiles,
    setTiles,
    isComplete,
    setIsComplete,
  };
}
