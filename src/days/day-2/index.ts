import { day } from "../../utils/day";

const ShapeScore: Record<string, number> = {
  X: 1,
  Y: 2,
  Z: 3,
  A: 1,
  B: 2,
  C: 3,
};

const isDraw = (a: number, b: number) => a === b;
const isWin = (a: number, b: number) => (b === 1 && a === 3) || (b === 2 && a === 1) || (b === 3 && a === 2);

export default day({
  part1Fn: (rounds) => {
    let score = 0;

    const processed = rounds.map((round) => round.split(" ").map((x) => ShapeScore[x]));
    for (const [a, b] of processed) {
      if (isWin(a, b)) {
        score += b + 6;
      } else if (isDraw(a, b)) {
        score += b + 3;
      } else {
        score += b;
      }
    }

    return score;
  },
  part1Expected: 15,
});
