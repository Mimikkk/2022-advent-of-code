import { filter, split, identity, map, pipe, sum, chunk } from "lodash/fp";
import { day, Preprocess } from "../../utils";

// |                 |s1 --- a --- e1|  |
// |       |s2 --- b --- e2|            |

// s1 < e2 || e1 > s2

type Range = [number, number];
type RangePair = [Range, Range];
const hasFullOverlap = ([[s1, e1], [s2, e2]]: RangePair) => s1 <= s2 && e1 >= e2;
const hasPartialOverlap = ([[s1, e1], [s2, e2]]: RangePair) => s1 <= e2 && e1 >= s2;

const hasOverlap =
  (type: "full" | "partial") =>
  ([a, b]: RangePair) =>
    type === "full" ? hasFullOverlap([a, b]) || hasFullOverlap([b, a]) : hasPartialOverlap([a, b]);

const intoRanges = pipe(
  filter(identity),
  map(pipe(split(","), map(split("-")), map(map(Number))))
) as Preprocess<RangePair[]>;

export default day({
  first: {
    preprocess: intoRanges,
    solution: pipe(map(hasOverlap("full")), sum),
    expected: 2,
  },
  second: {
    preprocess: intoRanges,
    solution: pipe(map(hasOverlap("partial")), sum),
    expected: 4,
  },
});
