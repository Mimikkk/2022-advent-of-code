import {
  isNaN,
  filter,
  identity,
  map,
  negate,
  pipe,
  range,
  split,
  sum,
  add,
  find,
  times,
  join,
  chunk,
} from "lodash/fp";
import { day, Preprocess } from "../../utils";
import { cond } from "lodash";

type Command = ["noop"] | ["addx", number];
const isNoop = (command: Command): command is ["noop"] => command.length === 1;
const isAddx = (command: Command): command is ["addx", number] => command.length === 2;

const preprocess = pipe(
  filter(identity),
  map(
    pipe(
      split(" "),
      ([x, y]) => [x, +y],
      filter(negate(isNaN)),
      (c: Command) => [c, isNoop(c) ? 1 : 2]
    )
  )
) as Preprocess<[Command, number][]>;

export default day({
  first: {
    preprocess,
    solution: (commands) => {
      const signals: number[] = [];

      let [X, C] = [1, 0];
      commands.forEach(([command, iters]) => {
        pipe(
          add(1),
          range(1),
          find((i) => !!(!((C - 20 + i) % 40) && signals.push((C + i) * X))),
          () => (C += iters)
        )(iters);

        cond([[isAddx, ([, add]) => (X += add!)]])(command);
      });

      return sum(signals);
    },
    expected: 13140,
  },
  second: {
    preprocess,
    solution: (commands) => {
      const crt: string[] = [];

      let [X, C] = [1, 0];
      commands.forEach(([command, iters]) => {
        for (let i = 0; i < iters; ++i) {
          crt.push([X - 1, X, X + 1].includes(C % 40) ? "#" : ".");

          C += 1;
          if (i === 1 && isAddx(command)) X += command[1];
        }
      });

      return pipe(chunk(40), map(join("")), join("\n"))(crt);
    },
    expected: pipe(
      split(/[ \n\r]+/g),
      filter(identity),
      join("\n")
    )(`
      ##..##..##..##..##..##..##..##..##..##..
      ###...###...###...###...###...###...###.
      ####....####....####....####....####....
      #####.....#####.....#####.....#####.....
      ######......######......######......####
      #######.......#######.......#######.....
    `),
  },
});
