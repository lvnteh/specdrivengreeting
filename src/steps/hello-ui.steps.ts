// src/steps/hello-ui.steps.ts
// Step definitions for specs/features/hello-greeting-ui.feature
// Uses Playwright's page fixture for real browser interaction.
// The server must be running on localhost:3010 before tests run.

import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

// ---------------------------------------------------------------------------
// Given steps — navigate to the page
// ---------------------------------------------------------------------------

Given("I open the greeting page", async ({ page }) => {
  await page.goto("/");
  // Wait until the "Right now" card finishes loading (loses the "loading" class)
  await expect(page.locator("#now-greeting")).not.toHaveClass(/loading/, {
    timeout: 5000,
  });
});

// ---------------------------------------------------------------------------
// When steps — interact with the date picker
// ---------------------------------------------------------------------------

When(
  "I pick the date {string} and press Go",
  async ({ page }, date: string) => {
    // Set the input value via JS to bypass browser-side date validation
    // (Playwright's fill() rejects calendar-invalid dates like "2026-13-01")
    await page.locator("#date-input").evaluate(
      (el: HTMLInputElement, val: string) => {
        el.value = val;
      },
      date
    );
    await page.locator("#pick-btn").click();
  }
);

// ---------------------------------------------------------------------------
// Then steps — assert UI state
// ---------------------------------------------------------------------------

Then("a non-empty greeting is visible in the now card", async ({ page }) => {
  const greeting = page.locator("#now-greeting");
  // Must have some text content and not still show the loading placeholder
  await expect(greeting).not.toHaveText("Loading…");
  await expect(greeting).not.toBeEmpty();
});

Then(
  "the picked greeting shows {string}",
  async ({ page }, expected: string) => {
    await expect(page.locator("#picked-greeting")).toHaveText(expected, {
      timeout: 5000,
    });
  }
);

Then(
  "the picked meta contains {string}",
  async ({ page }, text: string) => {
    await expect(page.locator("#picked-meta")).toContainText(text, {
      timeout: 5000,
    });
  }
);

Then("no holiday is shown in the picked meta", async ({ page }) => {
  // When there is no holiday the renderGreeting function sets metaEl.textContent = ""
  await expect(page.locator("#picked-meta")).toBeEmpty({ timeout: 5000 });
});

Then("a toast message is visible", async ({ page }) => {
  // The toast gains the class "show" and gets non-empty text when an error occurs
  await expect(page.locator("#toast")).toHaveClass(/show/, { timeout: 5000 });
  await expect(page.locator("#toast")).not.toBeEmpty();
});
