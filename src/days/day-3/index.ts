import { filter, identity, map, pipe, sum } from "lodash/fp";
import { day, Preprocess } from "../../utils";

const code = (char: string) => char.charCodeAt(0);
const charvalue = pipe(code, (code) => code - (code > 90 ? 96 : 38));

const splitInHalf = (str: string) => [str.slice(0, str.length / 2), str.slice(str.length / 2)];
export default day({
  first: {
    preprocess: pipe(filter(identity), map(splitInHalf)) as Preprocess<[string, string][]>,
    solution: pipe(
      map(([x, y]) => [new Set(x), new Set(y)]),
      map(([a, b]) => [...a].find((x) => b.has(x))),
      map(charvalue),
      sum
    ),
    expected: 157,
  },
});
