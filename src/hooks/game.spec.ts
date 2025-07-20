import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGame } from './game';

describe('useGame', () => {
  it('should add a tile when setTile is called', () => {
    const { result } = renderHook(() => useGame());
    act(() => result.current.setTile('5'));
    expect(result.current.tiles).toEqual(['5']);
  });

  it('should not add a tile if the size limit is reached', () => {
    const { result } = renderHook(() => useGame(2));
    act(() => {
      result.current.setTile('5');
      result.current.setTile('3');
      result.current.setTile('1'); // This should not be added
    });
    expect(result.current.tiles).toEqual(['5', '3']);
  });

  it('should remove the last tile when onDelete is called', () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.setTile('5');
      result.current.setTile('3');
      result.current.onDelete();
    });
    expect(result.current.tiles).toEqual(['5']);
  });

  it('should reflect the correct isComplete state', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.isComplete).toBe(false);
    act(() => result.current.setIsComplete(true));
    expect(result.current.isComplete).toBe(true);
  });
});
