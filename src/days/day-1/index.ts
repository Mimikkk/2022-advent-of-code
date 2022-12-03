import { reduce, __, map, tap, take, subtract, pipe, sortBy, sum, add, first } from "lodash/fp";
import { day, Preprocess } from "../../utils";

export default day({
  first: {
    preprocess: map(Number) as Preprocess<number[]>,
    solution: pipe(
      reduce(([max, sum], calorie) => [calorie ? max : Math.max(max, sum), sum + (calorie || -sum)], [0, 0]),
      first
    ),
    expected: 24000,
  },

  second: {
    preprocess: map(Number) as Preprocess<number[]>,
    solution: pipe(
      reduce(
        ([max, sum], calorie) => [calorie ? max : (max.push(sum), max), sum + (calorie || -sum)] as [number[], number],
        [[], 0] as [number[], number]
      ),
      first,
      pipe(sortBy(subtract(0)), take(3), sum)
    ),
    expected: 45000,
  },
});
