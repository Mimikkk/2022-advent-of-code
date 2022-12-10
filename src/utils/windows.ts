const windowGenerator = function* <T>(items: T[], size: number) {
  for (let i = 0; i + size <= items.length; ++i) yield items.slice(i, i + size);
};

export const windows =
  (size: number) =>
  <T>(items: T[]) =>
    Array.from(windowGenerator(items, size));
