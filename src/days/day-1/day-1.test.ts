import { day } from "../../utils/day";

day(1)({
  part1Fn: (lines) => {
    let max = 0;
    lines.reduce((sum, calorie) => sum + (calorie === "" ? ((max = Math.max(max, sum)), -sum) : +calorie), 0);

    return max;
  },
  part1Expected: 24000,
  part2Fn: (lines) => {
    let max: number[] = [];
    lines.reduce((sum, calorie) => sum + (calorie === "" ? (max.push(sum), -sum) : +calorie), 0);

    return max
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a + b);
  },
  part2Expected: 45000,
});
