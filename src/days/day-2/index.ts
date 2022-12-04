import { filter, identity, map, pipe, sum } from "lodash/fp";
import { day, Preprocess } from "../../utils";

const isDraw = (a: number, b: number) => a === b;
const isWin = (a: number, b: number) =>
  (b === 1 && a === 3) || (b === 2 && a === 1) || (b === 3 && a === 2);

const Shape: Record<string, number> = {
  X: 1,
  Y: 2,
  Z: 3,
  A: 1,
  B: 2,
  C: 3,
};
const Outcome: Record<string, number> = {
  AX: Shape.C,
  BX: Shape.A,
  CX: Shape.B,
  AY: Shape.A + 3,
  BY: Shape.B + 3,
  CY: Shape.C + 3,
  AZ: Shape.B + 6,
  BZ: Shape.C + 6,
  CZ: Shape.A + 6,
};

const scorematch = ([a, b]: number[]) => (isWin(a, b) && b + 6) || (isDraw(a, b) && b + 3) || b;
export default day({
  first: {
    preprocess: filter(identity) as Preprocess<string[]>,
    solution: pipe(
      map((round) => round.split(" ").map((x) => Shape[x])),
      map(scorematch),
      sum
    ),
    expected: 15,
  },
  second: {
    preprocess: filter(identity) as Preprocess<string[]>,
    solution: pipe(
      map((round) => Outcome[round.replace(" ", "")]),
      sum
    ),
    expected: 12,
  },
});
