import { each, entries, identity } from "lodash";
import { describe, it } from "vitest";
import { readlines, TestType } from "./file";

export type Fn<Input, Result> = (input: Input) => Result | Promise<Result>;

export interface Part<Input, Result> {
  preprocess?: Fn<string[], Input>;
  solution: Fn<Input, Result>;
  expected: Result;
}
export interface DayProps<Result1, Result2, Input1, Input2> {
  first?: Part<Input1, Result1>;
  second?: Part<Input2, Result2>;
}

export const day =
  <R1, R2, I1, I2>(parts: DayProps<R1, R2, I1, I2>) =>
  (day: number) => {
    describe.concurrent(`Advent of Code: Day ${day}`, () => {
      entries(parts).forEach(([name, { solution, expected, preprocess = identity }]) => {
        const read = async (type: TestType) => {
          const lines = await readlines(day, type);

          return preprocess(lines);
        };

        describe(`Part ${name}`, async () => {
          it(`Should return ${expected} for test input`, async () => {
            const lines = await read("test");

            expect(await solution(lines)).toBe(expected);
          });
          it(`Try for real input`, async () => {
            const lines = await read("real");

            console.info(`Day ${day} - Part 1::Expected Answer:\n- ${await solution(lines)}`);
          });
        });
      });
    });
  };
