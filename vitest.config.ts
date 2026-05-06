import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts"],
      exclude: [
        "src/lib/stores/*.ts",
        "src/lib/repositories/*.ts",
        "src/generated/**",
        "src/lib/services/stripe.ts",
        "src/lib/services/email.ts",
        "src/lib/services/storage.ts",
      ],
      thresholds: {
        statements: 30,
        branches: 25,
        functions: 30,
        lines: 30,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
