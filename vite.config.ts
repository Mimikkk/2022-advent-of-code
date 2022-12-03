import { defineConfig } from "vite";
import dynamic from "vite-plugin-dynamic-import";
export default defineConfig({
  test: {
    globals: true,
    reporters: [],
  },
  plugins: [dynamic()],
});
