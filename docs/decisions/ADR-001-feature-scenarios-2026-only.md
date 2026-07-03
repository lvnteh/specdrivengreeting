# ADR-001: Feature scenarios use 2026 dates only

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Levente Hernadi (PM)

---

## Context

The greeting endpoint has a `?date` query parameter that allows callers to override the server clock. The business rule is that this parameter only accepts dates in the current year (2026). Passing a 2025 or 2027 date returns a 400 error.

The holiday table in `handlers.ts` covers both 2025 and 2026, because the original `cases.json` guard called `findGreeting()` as a pure function — bypassing HTTP-layer validation entirely. This meant 2025 dates could be used as test inputs without triggering the year restriction.

When `cases.json` was replaced with Playwright BDD (Gherkin), scenarios shifted to making real HTTP requests. Every date in the feature file now goes through the full request pipeline, including year validation.

---

## Decision

Feature scenarios use 2026 dates exclusively.

The 2025 holiday data remains in `handlers.ts` for runtime correctness (the server may be running across a year boundary), but it is not exercised at the HTTP layer by the feature guard.

---

## Options Considered

### Option A — 2026 dates only (chosen)
Use only 2026 dates in the feature file. Accept that 2025 holiday data is not HTTP-tested.

**Pros:**
- No change to business rules
- Feature file reflects what the API actually accepts
- Simple

**Cons:**
- 2025 holiday data in the handler is untested at the HTTP layer
- If a bug exists only in the 2025 data, it won't be caught by `guard:features`

### Option B — Expand the year rule
Allow any year covered by the holiday table (2025 and 2026), not just the current year. The error message would change to "Only supported years are allowed."

**Pros:**
- All holiday data tested end-to-end
- More flexible for future years

**Cons:**
- Changes the product behaviour (2025 dates would no longer return 400)
- Requires updates to `openapi.yaml`, `handlers.ts`, error messages, and Arazzo workflows
- Broader scope than the migration warranted

---

## Consequences

- `specs/features/hello-greeting.feature` contains only 2026 dates
- The boundary scenario (Dec 15 → Christmas 10 days away) and tie-break scenarios are recalculated for 2026 holiday dates, which differ from 2025 (e.g. Hanukkah is Dec 4 in 2026 vs Dec 14 in 2025)
- `cases.json` and `guard-cases.ts` are retired but not yet deleted — they remain as reference only
- If the year rule is ever expanded (Option B), this ADR should be superseded and the feature file updated to include multi-year rows

---

## Related

- `specs/features/hello-greeting.feature` — the feature file this decision shapes
- `src/implementation/handlers.ts` — holiday table covering 2025 and 2026
- `src/implementation/handlers.ts` → `validateDateParam()` — enforces the 2026-only rule
