import { filter, identity, map, pipe, sum, chunk } from "lodash/fp";
import { day, Preprocess } from "../../utils";

const code = (char: string) => char.charCodeAt(0);
const charvalue = pipe(code, (code) => code - (code > 90 ? 96 : 38));
const uniques = (sets: string[]) => sets.map((s) => new Set(s));

const intersection = (sets: Set<string>[]) => [...sets[0]].find((char) => sets.every((set) => set.has(char)));
const splitInHalf = (str: string) => [str.slice(0, str.length / 2), str.slice(str.length / 2)];
export default day({
  first: {
    preprocess: pipe(filter(identity), map(splitInHalf)) as Preprocess<[string, string][]>,
    solution: pipe(map(uniques), map(intersection), map(charvalue), sum),
    expected: 157,
  },
  second: {
    preprocess: pipe(filter(identity), chunk(3)) as Preprocess<[string, string, string][]>,
    solution: pipe(map(uniques), map(intersection), map(charvalue), sum),
    expected: 70,
  },
});
