import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "specs/features/**/*.feature",
  steps: "src/steps/**/*.ts",
});

export default defineConfig({
  testDir,
  use: {
    baseURL: "http://localhost:3010",
  },
  // No browser needed — pure API tests
  projects: [
    {
      name: "api",
    },
  ],
});
