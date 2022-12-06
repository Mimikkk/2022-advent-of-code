import { split, pipe, join, findIndex, uniq, add } from "lodash/fp";
import { day, Preprocess } from "../../utils";

const windowGenerator = function* <T>(items: T[], size: number) {
  for (let i = 0; i + size <= items.length; ++i) yield items.slice(i, i + size);
};

const windows =
  (size: number) =>
  <T>(items: T[]) =>
    Array.from(windowGenerator(items, size));

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
