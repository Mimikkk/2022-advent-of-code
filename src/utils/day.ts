import { identity } from "lodash/fp";
import { describe, it } from "vitest";
import { readlines, TestType } from "./file";

export type ResultFn<Input, Result> = (input: Input) => Result | Promise<Result>;
export interface DayProps<Result1, Result2, Input = string[]> {
  first: {
    solution: ResultFn<Input, Result1>;
    expected: Result1;
  };
  second?: {
    solution: ResultFn<Input, Result2>;
    expected: Result2;
  };
  preprocess?: Preprocess<Input>;
}
export type Preprocess<Output> = (values: string[]) => Output | Promise<Output>;

export const day =
  <R1, R2, Input>({ first, second, preprocess = identity }: DayProps<R1, R2, Input>) =>
  (day: number) => {
    const read = async (type: TestType) => {
      const lines = await readlines(day, type);

      return preprocess(lines);
    };

    describe.concurrent(`Advent of Code: Day ${day}`, () => {
      describe("Part 1", async () => {
        it(`Should return ${first.expected} for test input`, async () => {
          const lines = await read("test");

          expect(await first.solution(lines)).toBe(first.expected);
        });
        it(`Try for real input`, async () => {
          const lines = await read("real");

          console.info(`Day ${day} - Part 1::Expected Answer:\n- ${await first.solution(lines)}`);
        });
      });

      if (!second) return;
      describe("Part 2", async () => {
        it(`Should return ${second.expected} for test input`, async () => {
          const lines = await read("test");

          expect(await second.solution(lines)).toBe(second.expected);
        });

        it(`Try for real input`, async () => {
          const lines = await read("real");

          console.info(`Day ${day} - Part 2::Expected Answer:\n- ${await second.solution(lines)}`);
        });
      });
    });
  };
