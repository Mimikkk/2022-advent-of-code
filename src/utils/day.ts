import { describe, it } from "vitest";
import { readlines } from "./file";

export type DayFn<T> = (values: string[]) => T | Promise<T>;
export type DayProps<P1, P2> = {
  part1Fn: DayFn<P1>;
  part1Expected: P1;
  part2Fn?: DayFn<P2>;
  part2Expected?: P2;
};
export const day =
  (day: number) =>
  <P1, P2>({ part1Fn, part1Expected, part2Fn, part2Expected }: DayProps<P1, P2>) => {
    describe.concurrent("Advent of Code: Day {day}", () => {
      describe("Part 1", async () => {
        it(`Should return ${part1Expected} for test input`, async () => {
          expect(await part1Fn(await readlines(day, "test"))).toBe(part1Expected);
        });
        it(`Try for real input`, async () => {
          console.info(`Part 1 Expected Answer:\n- ${await part1Fn(await readlines(day, "real"))}`);
        });
      });

      if (!part2Fn) return;
      describe("Part 2", async () => {
        it(`Should return ${part2Expected} for test input`, async () => {
          expect(await part2Fn(await readlines(day, "test"))).toBe(part2Expected);
        });

        it(`Try for real input`, async () => {
          console.info(`Part 2 Expected Answer:\n- ${await part2Fn(await readlines(day, "real"))}`);
        });
      });
    });
  };
