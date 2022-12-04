import { filter, identity, map, pipe, sum, chunk } from "lodash/fp";
import { day, Fn, Preprocess } from "../../utils";

const code = (char: string) => char.charCodeAt(0);
const charvalue = pipe(code, (code) => code - (code >= 96 ? 96 : 38));
const uniques = map((s) => new Set(s)) as Fn<string[], Set<string>[]>;

const intersection = (sets: Set<string>[]) =>
  [...sets[0]].find((char) => sets.every((set) => set.has(char)));

const splitInHalf = (str: string) => [str.slice(0, str.length / 2), str.slice(str.length / 2)];
export default day({
  first: {
    preprocess: pipe(filter(identity), map(splitInHalf)) as Preprocess<[string, string][]>,
    solution: pipe(map(pipe(uniques, intersection, charvalue)), sum),
    expected: 157,
  },
  second: {
    preprocess: pipe(filter(identity), chunk(3)) as Preprocess<[string, string, string][]>,
    solution: pipe(map(pipe(uniques, intersection, charvalue)), sum),
    expected: 70,
  },
});
