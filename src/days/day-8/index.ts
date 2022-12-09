import {
  flatMap,
  max,
  multiply,
  filter,
  identity,
  sum,
  range,
  reduce,
  pipe,
  map,
  __,
} from "lodash/fp";
import { day, Preprocess } from "../../utils";

const directions = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

const inBoundsOf = (x: number, y: number, width: number, height: number) =>
  x >= 0 && x < width && y >= 0 && y < height;
const atBoundsOf = (x: number, y: number, width: number, height: number) =>
  x === 0 || x === width - 1 || y === 0 || y === height - 1;

const createVisibilityChecker = (grid: string[]) => {
  const [w, h] = [grid.length, grid[0]?.length];
  const inBounds = (x: number, y: number) => inBoundsOf(x, y, w, h);
  const atBounds = (x: number, y: number) => atBoundsOf(x, y, w, h);

  return (x: number) => (y: number) =>
    directions.some(([dx, dy]) => {
      let [height, nx, ny] = [+grid[x][y], x + dx, y + dy];
      let val = +grid[nx][ny];

      while (inBounds(nx, ny) && val < height) [val, nx, ny] = [+grid[nx][ny], nx + dx, ny + dy];
      nx -= dx;
      ny -= dy;

      return val < height && atBounds(nx, ny);
    });
};

const createScenicScoreCalculator = (grid: string[]) => {
  const [h, w] = [grid.length, grid[0]?.length];
  const inBounds = (x: number, y: number) => inBoundsOf(x, y, w, h);

  return (x: number) => (y: number) =>
    reduce(
      multiply,
      1,
      directions.map(([dx, dy]) => {
        let [height, nx, ny] = [+grid[x][y], x + dx, y + dy];
        let val = +grid[nx][ny];
        let count = 0;

        while (inBounds(nx, ny) && val < height) {
          [val, nx, ny] = [+grid[nx][ny], nx + dx, ny + dy];
          count += 1;
          if (val >= height) return count;
        }
        return count;
      })
    );
};

const preprocess = pipe(filter(identity), (grid) => [
  grid,
  grid.length,
  grid[0]?.length,
]) as Preprocess<[string[], number, number]>;

export default day({
  first: {
    preprocess,
    solution: ([grid, h, w]) =>
      2 * (h + w) -
      4 +
      sum(flatMap(pipe(createVisibilityChecker(grid), map(__, range(1, w - 1))), range(1, h - 1))),
    expected: 21,
  },
  second: {
    preprocess,
    solution: ([grid, h, w]) =>
      max(
        flatMap(pipe(createScenicScoreCalculator(grid), map(__, range(1, w - 1))), range(1, h - 1))
      ),
    expected: 8,
  },
});
