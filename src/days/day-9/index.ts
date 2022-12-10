import { filter, identity, map, pipe, range, slice, split, times } from "lodash/fp";
import { day, Preprocess, windows } from "../../utils";

type Coord = [number, number];
namespace Coord {
  type Self = Coord;

  export const add = ([x, y]: Self, [ox, oy]: Self): Self => [x + ox, y + oy];
  export const sub = ([x, y]: Self, [ox, oy]: Self): Self => [x - ox, y - oy];

  export const createSet = (): Set<Coord> =>
    new (class extends Set {
      override add([x, y]: Coord) {
        return super.add(JSON.stringify([x, y]));
      }
      override has([x, y]: Coord) {
        return super.has(JSON.stringify([x, y]));
      }

      override delete([x, y]: Coord) {
        return super.delete(JSON.stringify([x, y]));
      }

      override *[Symbol.iterator]() {
        for (const item of super.values()) yield JSON.parse(item);
      }
    })();
}

const Directions: Record<string, Coord> = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1],
};

const preprocess = pipe(
  filter(identity),
  map(pipe(split(" "), ([first, second]) => [Directions[first], +second]))
) as Preprocess<[Coord, number][]>;

const solution = (n: number) => (commands: [Coord, number][]) => {
  const visited = Coord.createSet();
  const S = times((): Coord => [0, 0], n);

  commands.forEach(([D, count]) =>
    range(0, count).forEach(() => {
      S[0] = Coord.add(S[0], D);

      windows(2)(S).forEach(([prev, C]) => {
        const [dx, dy] = Coord.sub(prev, C);

        if (Math.abs(dx) >= 2) {
          C[0] += Math.sign(dx);

          if (Math.abs(dy)) C[1] += Math.sign(dy);
        } else if (Math.abs(dy) >= 2) {
          C[1] += Math.sign(dy);

          if (Math.abs(dx)) C[0] += Math.sign(dx);
        }
      });

      visited.add(S.at(-1)!);
    })
  );

  return visited.size;
};

export default day({
  first: {
    preprocess,
    solution: solution(2),
    expected: 13,
  },
  second: {
    preprocess,
    solution: solution(10),
    expected: 1,
  },
});
