function getRandInt(max?: number) {
  return Math.floor(Math.random() * (max ?? 10));
}

function getRandIntInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNumByDigitCount(digitCount: number) {
  if (digitCount < 1 || digitCount > 3) {
    throw new Error('Digit count must be between 1 and 3');
  }
  const min = Math.pow(10, digitCount - 1);
  const max = Math.pow(10, digitCount) - 1;
  return getRandIntInRange(min, max);
}

const operators = ['+', '-', '*', '/'] as const;

type Operator = (typeof operators)[number];

const mappedOperators: Record<Operator, (a: number, b: number) => number> = {
  '+': (a: number, b: number) => a + b,
  '-': (a: number, b: number) => a - b,
  '*': (a: number, b: number) => a * b,
  '/': (a: number, b: number) => a / b,
};

function shuffle(array: (number | string)[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

type StringNumArray = (string | number)[];

export function createRandomEquation() {
  const ops = Array.from(
    { length: getRandIntInRange(1, 2) },
    () => operators[getRandInt(operators.length)]
  );

  const opsCount = ops.length;
  const divisionCount = ops.filter((op) => op === '/').length;

  if (divisionCount === 2) {
    while (true) {
      const num1 = getNumByDigitCount(1);
      const num2 = getNumByDigitCount(1);
      const num3 = num1 * num2; // ensure no decimals
      return [num3, '/', num2, '/', num1];
    }
  } else if (divisionCount === 1 && opsCount === 2) {
    // if there is one division operator, we can pair the numbers together to ensure no decimals
    const num1 = getRandIntInRange(10, 99);
    const num2 = getRandIntInRange(1, 9);
    const num3 = getRandIntInRange(1, 9);
    return [num1, ops[0], num2, ops[1], num3];
  } else if (divisionCount === 1) {
    while (true) {
      const divisor = getNumByDigitCount(2);
      const dividend = getNumByDigitCount(1) * divisor; // ensure no decimals
      if (dividend >= 100 && dividend <= 999) {
        return [dividend, '/', divisor];
      }
    }
  } else {
    // if there are no division operators, we can generate a simple equation
    const nums = shuffle(
      opsCount === 1
        ? [getNumByDigitCount(3), getNumByDigitCount(2)]
        : [getNumByDigitCount(2), getNumByDigitCount(1), getNumByDigitCount(1)]
    );
    const final: StringNumArray = [];
    ops.forEach((op, index) => {
      final.push(nums[index]);
      final.push(op);
    });
    final.push(nums.at(-1)!);
    return final;
  }
}

export function tilesToTokens(tiles: string[]) {
  const tokens: (string | number)[] = [];
  let currentNumber = '';

  for (const tile of tiles) {
    if (!isNaN(Number(tile))) {
      currentNumber += tile;
    } else {
      if (currentNumber) {
        tokens.push(Number(currentNumber));
        currentNumber = '';
      }
      tokens.push(tile);
    }
  }

  if (currentNumber) {
    tokens.push(Number(currentNumber));
  }

  return tokens;
}

// 2 scenarios:
// 1 operator, 1 3-digit and 1 2-digit
// 2 operators, 1 2-digit and 2 1-digit
// if 2 divisors, then work upwards
// if 1 divisor, then pair then together to ensure no decimals
/**
 * 321 + 45
 * 144 / 12
 * 12 / 6 / 2
 */

export function equationToMap(equation: (string | number)[]) {
  const map: Record<string, number[]> = {};
  equation
    .map(String)
    .join('')
    .split('')
    .forEach((token, index) => {
      if (typeof token === 'string') {
        if (!map[token]) {
          map[token] = [];
        }
        map[token].push(index);
      }
    });
  return map;
}

export function calculateTotal(tiles: string[]) {
  // check edge cases
  if (
    isNaN(Number(tiles[0])) ||
    isNaN(Number(tiles.at(-1))) ||
    /[-+*/][-+*/]/.test(tiles.join(''))
  ) {
    return NaN;
  }
  const arr = tilesToTokens(tiles);

  let idx = 0;
  while (idx < arr.length - 1) {
    const num1 = arr[idx] as number;
    const operator = arr[idx + 1] as Operator;
    const num2 = arr[idx + 2] as number;

    if (['*', '/'].includes(operator)) {
      if (operator === '/' && num2 === 0) return NaN;
      arr[idx] = mappedOperators[operator](num1, num2);
      arr.splice(idx + 1, 2); // remove the operator and the next number
    } else {
      idx += 2;
    }
  }

  let answer = arr[0] as number;
  for (let i = 1; i < arr.length - 1; i += 2) {
    answer = mappedOperators[arr[i] as Operator](answer, arr[i + 1] as number);
  }

  return answer;
}

export function mapToBoard(map: Record<string, number[]>) {
  const board: string[] = [];
  Object.entries(map).forEach(([key, indices]) => {
    indices.forEach((index) => {
      board[index] = key;
    });
  });
  return board;
}

Array.from({ length: 20 }, (_, i) => i).forEach(() => {
  console.log(createRandomEquation());
});
