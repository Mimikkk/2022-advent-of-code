import {
  split,
  pipe,
  findIndex,
  filter,
  identity,
  map,
  fromPairs,
  slice,
  startsWith,
  reduce,
  sum,
} from "lodash/fp";
import { day, Preprocess } from "../../utils";
import { assignIn, partial } from "lodash";
interface Dir extends Record<string, Dir | number> {
  size: number;
}

const accessByPath = (dir: Dir, path: string[]): Dir => {
  if (path.length === 0) return dir as Dir;

  const [first, ...rest] = path;
  if (!(first in dir)) dir[first] = { size: 0 };
  return accessByPath(dir[first] as Dir, rest);
};

const preprocess = pipe(filter(identity), (lines) => {
  let current: string[] = [];
  const dirs: Dir = { size: 0 };

  let line: string;
  while ((line = lines.shift()!)) {
    const [operator, command, arg] = line.split(" ");
    if (operator !== "$") continue;

    if (command === "cd")
      if (arg === "/") current.length = 0;
      else if (arg === "..") current.pop();
      else current.push(arg);
    else if (command == "ls")
      pipe(
        findIndex(startsWith("$")),
        (x) => (x === -1 ? lines : slice(0, x, lines)),
        map(split(" ")),
        filter(([size]) => size !== "dir"),
        map(([size, filename]) => [filename, +size]),
        fromPairs,
        partial(assignIn, accessByPath(dirs, current))
      )(lines);
  }

  const defineRecursiveSizes = (dirs: Dir, current: number = 0) => {
    let size = current;

    for (const key in dirs) {
      if (typeof dirs[key] === "number") {
        size += +dirs[key];
        delete dirs[key];
      } else size += defineRecursiveSizes(dirs[key] as Dir, current);
    }
    return (dirs.size = size);
  };

  defineRecursiveSizes(dirs);
  return dirs;
}) satisfies Preprocess<Dir>;

const UpdateSize = 30_000_000;
const DiskSize = 70_000_000;
const extractSizes = ({ size, ...dirs }: Dir): number[] => [
  size,
  //@ts-expect-error
  ...Object.values(dirs).flatMap(extractSizes),
];

export default day({
  first: {
    preprocess,
    solution: pipe(
      extractSizes,
      filter((x) => x <= 100000),
      sum
    ),
    expected: 95437,
  },
  second: {
    preprocess,
    solution: ({ size: totalSize, ...dirs }) => {
      const required = UpdateSize - (DiskSize - +totalSize);

      return pipe(
        extractSizes,
        reduce((min, size) => (size > required && size < min ? size : min), Infinity)
        //@ts-expect-error
      )(dirs);
    },
    expected: 24933642,
  },
});

