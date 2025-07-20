import { describe, it, expect } from 'vitest';
import { calculateTotal, equationToMap, mapToBoard } from './utils';

describe('calculateTotal', () => {
  it('should return NaN when there are two operators in a row', () => {
    const result = calculateTotal(['3', '+', '+', '5', '5', '1']);
    expect(result).toBe(NaN);
  });

  it('should return NaN when the first tile is not a number', () => {
    const result = calculateTotal(['+', '3', '5', '1', '0', '5']);
    expect(result).toBe(NaN);
  });

  it('should return the correct total for a valid expression', () => {
    const result = calculateTotal(['3', '+', '5', '*', '1', '0']);
    expect(result).toBe(53);
  });

  it ('should return the correct total for a valid expression with division', () => {
    const result = calculateTotal(['1', '2', '/', '6', '/', '2']);
    expect(result).toBe(1);
  });

  it('should return NaN when the last tile is not a number', () => {
    const result = calculateTotal(['3', '+', '5', '1', '0', '+']);
    expect(result).toBe(NaN);
  });

  it ('should return the correct total for a valid expression with multiple operators', () => {
    const result = calculateTotal(['3', '+', '4', '*', '2', '1']);
    expect(result).toBe(87);
  });
});

describe('mapToBoard', () => {
  it('should map the keys to their respective indices in the board', () => {
    const map = { '1': [0], '2': [1, 3], '3': [2], '+': [4], '5': [5] };
    const board = mapToBoard(map);
    expect(board).toEqual(['1', '2', '3', '2', '+', '5']);
  });
});

describe('equationToMap', () => {
  it('should create a map from the equation tokens', () => {
    const equation = [3, '+', 5, '*', 10];
    const map = equationToMap(equation);
    expect(map).toEqual({
      '3': [0],
      '+': [1],
      '5': [2],
      '*': [3],
      '1': [4],
      '0': [5],
    });
  });
});
