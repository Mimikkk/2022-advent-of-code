import _, {
  filter,
  isEmpty,
  split,
  identity,
  map,
  pipe,
  negate,
  toNumber,
  last,
  range,
  isEqual,
  reverse,
  join,
  concat,
  takeLast,
  dropLast,
  tap,
  each,
  first,
} from "lodash/fp";
import { day, Preprocess } from "../../utils";

type Command = [number, number, number];
const parseCommands = pipe(
  filter(identity),
  map(pipe(split(" "), map(toNumber), filter(negate(isNaN)))),
  map(([x, y, z]) => [x, y - 1, z - 1])
) as Preprocess<Command[]>;

const parseCrates = ((boxes) =>
  map(
    (i) =>
      pipe(
        map<string, string>((line) => line[i * 4 + 1]),
        filter(negate(isEqual(" "))),
        reverse
      )(boxes),
    range(0, +/\d+ *$/.exec(boxes.pop()!)?.[0]!)
  )) as Preprocess<string[][]>;

const createCratesAndCommands = ((lines) => [
  parseCrates(lines.splice(0, lines.findIndex(isEmpty))),
  parseCommands(lines),
]) as Preprocess<[string[][], Command[]]>;

const solution = (type: "reversed" | "identity") =>
  pipe(
    tap(([crates, commands]) =>
      each(([count, from, to]) => {
        crates[to] = concat(
          crates[to],
          pipe(takeLast(count), type === "reversed" ? reverse : identity)(crates[from])
        );
        crates[from] = dropLast(count, crates[from]);
      }, commands)
    ),
    first,
    map(last),
    join("")
  );

export default day({
  first: {
    preprocess: createCratesAndCommands,
    solution: solution("reversed"),
    expected: "CMZ",
  },
  second: {
    preprocess: createCratesAndCommands,
    solution: solution("identity"),
    expected: "MCD",
  },
});
