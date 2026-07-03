// guard:cases — runs every scenario in specs/cases.json against findGreeting() or the HTTP layer
// This is the executable version of the PM's test cases.
// Run with: npm run guard:cases

import { readFileSync } from "fs";
import { findGreeting, validateDateParam } from "./implementation/handlers.js";

type SuccessCase = {
  description: string;
  input: { date: string; useParam?: false };
  expected: { greeting: string; holiday: string | null; daysUntil: number | null };
};

type ParamSuccessCase = {
  description: string;
  input: { date: string; useParam: true };
  expected: { greeting: string; holiday: string | null; daysUntil: number | null };
};

type ParamErrorCase = {
  description: string;
  input: { date: string; useParam: true };
  expectedStatus: 400;
  expectedError: string;
};

type Case = SuccessCase | ParamSuccessCase | ParamErrorCase;

const cases = JSON.parse(
  readFileSync("specs/cases.json", "utf-8")
) as Case[];

let passed = 0;
let failed = 0;

for (const c of cases) {
  // Error cases — validate the date param and check error message
  if ("expectedStatus" in c) {
    const result = validateDateParam(c.input.date);
    const ok = result.type === "error" && result.error === c.expectedError;
    if (ok) {
      console.log(`✅ ${c.description}`);
      passed++;
    } else {
      console.log(`❌ ${c.description}`);
      if (result.type === "ok") {
        console.log(`   expected error "${c.expectedError}" but got a valid date`);
      } else {
        console.log(`   error:  got "${result.error}"  expected "${c.expectedError}"`);
      }
      failed++;
    }
    continue;
  }

  // Success cases — call findGreeting with the date from input
  const [y, m, d] = c.input.date.split("-").map(Number);
  const result = findGreeting(new Date(y, m - 1, d));

  const greetingOk = result.greeting === c.expected.greeting;
  const holidayOk = result.holiday === c.expected.holiday;
  const daysOk = result.daysUntil === c.expected.daysUntil;
  const ok = greetingOk && holidayOk && daysOk;

  if (ok) {
    console.log(`✅ ${c.description}`);
    passed++;
  } else {
    console.log(`❌ ${c.description}`);
    if (!greetingOk) console.log(`   greeting:  got "${result.greeting}"  expected "${c.expected.greeting}"`);
    if (!holidayOk)  console.log(`   holiday:   got "${result.holiday}"  expected "${c.expected.holiday}"`);
    if (!daysOk)     console.log(`   daysUntil: got ${result.daysUntil}  expected ${c.expected.daysUntil}`);
    failed++;
  }
}

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
