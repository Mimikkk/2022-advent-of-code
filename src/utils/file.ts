import { readFile } from "fs/promises";

type TestType = "real" | "test";

export const readinput = (day: number, type: TestType) =>
  readFile(`src/days/day-${day}/resources/${type}.txt`, "utf-8");
export const readlines = async (day: number, type: TestType) => (await readinput(day, type)).split("\n");
