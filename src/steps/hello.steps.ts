// src/steps/hello.steps.ts
// Step definitions for specs/features/hello-greeting.feature
// Each step maps one Gherkin line to an HTTP call or assertion.
// The server must be running on localhost:3010 before guard:features runs.

import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { Given, When, Then } = createBdd();

// Shared state within a scenario
let response: Response;
let body: Record<string, unknown>;

// ---------------------------------------------------------------------------
// When steps — make the HTTP request
// ---------------------------------------------------------------------------

// Used by holiday/boundary/tie-break/fallback scenarios (no ?date param — date
// is embedded in the path via the injected clock workaround is NOT needed here;
// we use the ?date param for all scenarios to keep things uniform and testable)
When("I call GET hello with date {string}", async ({ request }, date: string) => {
  response = await fetch(`http://localhost:3010/hello?date=${encodeURIComponent(date)}`);
  body = await response.json() as Record<string, unknown>;
});

// Used by date-param scenarios (explicit ?date param — same HTTP call, separate
// step kept distinct so the feature file reads naturally)
When("I call GET hello with date param {string}", async ({ request }, date: string) => {
  response = await fetch(`http://localhost:3010/hello?date=${encodeURIComponent(date)}`);
  body = await response.json() as Record<string, unknown>;
});

// ---------------------------------------------------------------------------
// Then steps — assert the response
// ---------------------------------------------------------------------------

Then("the status is {int}", async ({}, status: number) => {
  expect(response.status).toBe(status);
});

Then("the greeting is {string}", async ({}, greeting: string) => {
  expect(body.greeting).toBe(greeting);
});

Then("the holiday is {string}", async ({}, holiday: string) => {
  expect(body.holiday).toBe(holiday);
});

Then("the holiday is null", async ({}) => {
  expect(body.holiday).toBeNull();
});

Then("daysUntil is {int}", async ({}, daysUntil: number) => {
  expect(body.daysUntil).toBe(daysUntil);
});

Then("daysUntil is null", async ({}) => {
  expect(body.daysUntil).toBeNull();
});

Then("the error is {string}", async ({}, error: string) => {
  expect(body.error).toBe(error);
});
