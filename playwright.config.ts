import { defineConfig, devices } from "@playwright/test";
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
  projects: [
    // Pure API tests (no browser)
    {
      name: "api",
      testMatch: /hello-greeting\.feature\.spec\.js/,
    },
    // Browser-based UI tests
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /hello-greeting-ui\.feature\.spec\.js/,
    },
  ],
});
