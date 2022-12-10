import { split, pipe, join, findIndex, uniq, add } from "lodash/fp";
import { day, Preprocess, windows } from "../../utils";

const findIndexOfFirstNUniqueCharacters = (n: number) =>
  pipe(
    windows(n),
    findIndex((chars) => uniq(chars).length === n),
    add(n)
  );

const preprocess = pipe(join(""), split("")) satisfies Preprocess<string[]>;
export default day({
  first: {
    preprocess,
    solution: findIndexOfFirstNUniqueCharacters(4),
    expected: 7,
  },
  second: {
    preprocess,
    solution: findIndexOfFirstNUniqueCharacters(14),
    expected: 19,
  },
});
