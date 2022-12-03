import { sortBy, keys } from "rambda";

const days = import.meta.glob("./days/**/index.ts");
type ModuleFn = () => Promise<{ default: (day: number) => void }>;
const dayFromPath = (path: string) => +path.split("/").slice(-2, -1)[0].split("-")[1];

const ordered: Record<string, ModuleFn> = Object.fromEntries(
  sortBy(dayFromPath, keys(days)).map((key) => [dayFromPath(key), days[key] as ModuleFn])
);

for await (const [day, dayFn] of Object.entries(ordered)) {
  const { default: fn } = await dayFn();
  fn(+day);
}
