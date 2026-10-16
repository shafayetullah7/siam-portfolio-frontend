import path from "node:path";
import solid from "vite-plugin-solid";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
    exclude: ["**/node_modules/**", "**/.output/**"],
  },
});
