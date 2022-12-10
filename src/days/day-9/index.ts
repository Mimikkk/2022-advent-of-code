import { filter, identity, map, pipe, split, times } from "lodash/fp";
import { day, Preprocess } from "../../utils";

type Coord = [number, number];
namespace Coord {
  type Self = Coord;

  export function add(self: Self, other: number): Self;
  export function add(self: Self, other: Self): Self;
  export function add([x, y]: Self, other: Self | number): Self {
    if (typeof other === "number") return [x + other, y + other];

    const [ox, oy] = other;
    return [x + ox, y + oy];
  }
  export function sub(self: Self, other: number): Self;
  export function sub(self: Self, other: Self): Self;
  export function sub([x, y]: Self, other: Self | number): Self {
    if (typeof other === "number") return [x - other, y - other];

    const [ox, oy] = other;
    return [x - ox, y - oy];
  }

  export function times(self: Self, other: number): Self;
  export function times(self: Self, other: Self): Self;
  export function times([x, y]: Self, other: Self | number): Self {
    if (typeof other === "number") return [x * other, y * other];

    const [ox, oy] = other;
    return [x * ox, y * oy];
  }

  export const distance = ([ax, ay]: Self, [bx, by]: Self) =>
    Math.max(Math.abs(ax - bx), Math.abs(ay - by));

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

  commands.forEach(([D, count]) => {
    for (let step = 0; step < count; ++step) {
      S[0] = Coord.add(S[0], D);

      for (let i = 1; i < S.length; ++i) {
        const [dx, dy] = Coord.sub(S[i - 1], S[i]);

        console.log(Math.max(Math.abs(dx), Math.abs(dy)), dx, dy);
        if (Math.abs(dx) >= 2) {
          S[i][0] += Math.sign(dx);

          if (Math.abs(dy) != 0) S[i][1] += Math.sign(dy);
        } else if (Math.abs(dy) >= 2) {
          S[i][1] += Math.sign(dy);

          if (Math.abs(dx) != 0) S[i][0] += Math.sign(dx);
        }
      }

      visited.add(S.at(-1)!);
    }
  });

  return visited.size;
};

export default day({
  first: {
    preprocess,
    solution: solution(2),
    expected: 13,
    skipreal: true,
  },
  // second: {
  //   preprocess,
  //   solution: solution(10),
  //   expected: 1,
  //   skipreal: true,
  // },
});
