import { identity } from "lodash";
import { describe, it } from "vitest";
import { readlines, TestType } from "./file";

export type Fn<Input, Result> = (input: Input) => Result | Promise<Result>;
export type Preprocess<Result> = Fn<string[], Result>;

export interface Part<Input, Result> {
  preprocess?: Preprocess<Input>;
  solution: Fn<Input, Result>;
  expected: Result;
  skipreal?: boolean;
}
export interface DayProps<Result1, Result2, Input1, Input2> {
  first?: Part<Input1, Result1>;
  second?: Part<Input2, Result2>;
}

export const day =
  <R1, R2, I1, I2>(parts: DayProps<R1, R2, I1, I2>) =>
  (day: number) => {
    describe.concurrent(`Advent of Code: Day ${day}`, () => {
      Object.values(parts).forEach(
        ({ solution, expected, preprocess = identity, skipreal }, part) => {
          const read = async (type: TestType) => {
            const lines = await readlines(day, type);

            return preprocess(lines);
          };
          describe(`Part ${part + 1}`, async () => {
            it(`Should return ${expected} for test input`, async () => {
              const lines = await read("test");

              expect(await solution(lines)).toStrictEqual(expected);
            });

            if (skipreal) return;
            it(`Try for real input`, async () => {
              const lines = await read("real");

              console.info(
                `Day ${day} - Part ${part + 1}::Expected Answer:\n- ${await solution(lines)}`
              );
            });
          });
        }
      );
    });
  };
