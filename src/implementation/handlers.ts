// THIS FILE IS IMPLEMENTED BY THE AI AGENT.
// The agent may only modify this file.
// All other src/ files are generated or framework-owned.
//
// Contract: implement getHelloHandler and validateDateParam
// - getHelloHandler: read optional ?date query param; validate it; use it or fall back to server clock
// - validateDateParam: pure function — validates format (YYYY-MM-DD) and range (2026 only)
// - findGreeting: finds nearest holiday within 10 days of given date
// - Fall back to { greeting: "Hello World", holiday: null, daysUntil: null } when no match

import type { Context } from "hono";

// Holiday table — hardcoded for 2025 and 2026.
// Add years here as needed. Key format: "YYYY-MM-DD"
export const HOLIDAYS: Array<{ name: string; date: string; greeting: string }> = [
  // 2025
  { name: "New Year's Day", date: "2025-01-01", greeting: "Happy New Year!" },
  { name: "Martin Luther King Jr. Day", date: "2025-01-20", greeting: "Happy Martin Luther King Jr. Day!" },
  { name: "Lunar New Year", date: "2025-01-29", greeting: "Happy Lunar New Year!" },
  { name: "Valentine's Day", date: "2025-02-14", greeting: "Happy Valentine's Day!" },
  { name: "Holi", date: "2025-03-14", greeting: "Happy Holi!" },
  { name: "St. Patrick's Day", date: "2025-03-17", greeting: "Happy St. Patrick's Day!" },
  { name: "Easter", date: "2025-04-20", greeting: "Happy Easter!" },
  { name: "Earth Day", date: "2025-04-22", greeting: "Happy Earth Day!" },
  { name: "Cinco de Mayo", date: "2025-05-05", greeting: "Happy Cinco de Mayo!" },
  { name: "Mother's Day", date: "2025-05-11", greeting: "Happy Mother's Day!" },
  { name: "Juneteenth", date: "2025-06-19", greeting: "Happy Juneteenth!" },
  { name: "Midsummer / Summer Solstice", date: "2025-06-21", greeting: "Happy Midsummer!" },
  { name: "Independence Day", date: "2025-07-04", greeting: "Happy Independence Day!" },
  { name: "Bastille Day", date: "2025-07-14", greeting: "Bonne Fête Nationale!" },
  { name: "Raksha Bandhan", date: "2025-08-09", greeting: "Happy Raksha Bandhan!" },
  { name: "Obon", date: "2025-08-15", greeting: "Happy Obon!" },
  { name: "Labor Day", date: "2025-09-01", greeting: "Happy Labor Day!" },
  { name: "Rosh Hashanah", date: "2025-09-22", greeting: "Shanah Tovah!" },
  { name: "Diwali", date: "2025-10-20", greeting: "Happy Diwali!" },
  { name: "Halloween", date: "2025-10-31", greeting: "Happy Halloween!" },
  { name: "Día de los Muertos", date: "2025-11-01", greeting: "Feliz Día de los Muertos!" },
  { name: "Thanksgiving", date: "2025-11-27", greeting: "Happy Thanksgiving!" },
  { name: "Hanukkah", date: "2025-12-14", greeting: "Happy Hanukkah!" },
  { name: "Christmas", date: "2025-12-25", greeting: "Merry Christmas!" },

  // 2026
  { name: "New Year's Day", date: "2026-01-01", greeting: "Happy New Year!" },
  { name: "Martin Luther King Jr. Day", date: "2026-01-19", greeting: "Happy Martin Luther King Jr. Day!" },
  { name: "Lunar New Year", date: "2026-02-17", greeting: "Happy Lunar New Year!" },
  { name: "Valentine's Day", date: "2026-02-14", greeting: "Happy Valentine's Day!" },
  { name: "Holi", date: "2026-03-03", greeting: "Happy Holi!" },
  { name: "St. Patrick's Day", date: "2026-03-17", greeting: "Happy St. Patrick's Day!" },
  { name: "Easter", date: "2026-04-05", greeting: "Happy Easter!" },
  { name: "Earth Day", date: "2026-04-22", greeting: "Happy Earth Day!" },
  { name: "Cinco de Mayo", date: "2026-05-05", greeting: "Happy Cinco de Mayo!" },
  { name: "Mother's Day", date: "2026-05-10", greeting: "Happy Mother's Day!" },
  { name: "Juneteenth", date: "2026-06-19", greeting: "Happy Juneteenth!" },
  { name: "Midsummer / Summer Solstice", date: "2026-06-21", greeting: "Happy Midsummer!" },
  { name: "Independence Day", date: "2026-07-04", greeting: "Happy Independence Day!" },
  { name: "Bastille Day", date: "2026-07-14", greeting: "Bonne Fête Nationale!" },
  { name: "Raksha Bandhan", date: "2026-08-29", greeting: "Happy Raksha Bandhan!" },
  { name: "Obon", date: "2026-08-15", greeting: "Happy Obon!" },
  { name: "Labor Day", date: "2026-09-07", greeting: "Happy Labor Day!" },
  { name: "Rosh Hashanah", date: "2026-09-11", greeting: "Shanah Tovah!" },
  { name: "Diwali", date: "2026-11-08", greeting: "Happy Diwali!" },
  { name: "Halloween", date: "2026-10-31", greeting: "Happy Halloween!" },
  { name: "Día de los Muertos", date: "2026-11-01", greeting: "Feliz Día de los Muertos!" },
  { name: "Thanksgiving", date: "2026-11-26", greeting: "Happy Thanksgiving!" },
  { name: "Hanukkah", date: "2026-12-04", greeting: "Happy Hanukkah!" },
  { name: "Christmas", date: "2026-12-25", greeting: "Merry Christmas!" },
];

const WINDOW_DAYS = 10;
const FALLBACK = { greeting: "Hello World", holiday: null, daysUntil: null };

// Validates the ?date query parameter.
// Returns { type: "ok", date: Date } or { type: "error", error: string }
export function validateDateParam(raw: string):
  | { type: "ok"; date: Date }
  | { type: "error"; error: string } {
  // Must match YYYY-MM-DD exactly
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return { type: "error", error: "Nem valid datum, BLEGH" };

  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);

  // Check it's a real calendar date (e.g. not Feb 30)
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return { type: "error", error: "Nem valid datum, BLEGH" };
  }

  // Only 2026 is allowed
  if (y !== 2026) return { type: "error", error: "A Dátum csak idei lehet." };

  return { type: "ok", date };
}

export function findGreeting(today: Date): {
  greeting: string;
  holiday: string | null;
  daysUntil: number | null;
} {
  const todayDayMs = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  type Candidate = { holiday: typeof HOLIDAYS[0]; daysUntil: number };
  const candidates: Candidate[] = [];

  for (const holiday of HOLIDAYS) {
    const [y, m, d] = holiday.date.split("-").map(Number);
    const holidayDayMs = Date.UTC(y, m - 1, d);
    const daysUntil = Math.round((holidayDayMs - todayDayMs) / (1000 * 60 * 60 * 24));
    if (Math.abs(daysUntil) <= WINDOW_DAYS) {
      candidates.push({ holiday, daysUntil });
    }
  }

  if (candidates.length === 0) return FALLBACK;

  const best = candidates.reduce((a, b) => {
    const aUpcoming = a.daysUntil >= 0;
    const bUpcoming = b.daysUntil >= 0;
    if (aUpcoming && !bUpcoming) return a;
    if (!aUpcoming && bUpcoming) return b;
    const absDiff = Math.abs(a.daysUntil) - Math.abs(b.daysUntil);
    if (absDiff !== 0) return absDiff < 0 ? a : b;
    return b;
  });

  return {
    greeting: best.holiday.greeting,
    holiday: best.holiday.name,
    daysUntil: best.daysUntil,
  };
}

export async function getHelloHandler(c: Context) {
  const rawDate = c.req.query("date");

  if (rawDate !== undefined) {
    const validation = validateDateParam(rawDate);
    if (validation.type === "error") {
      return c.json({ error: validation.error }, 400);
    }
    return c.json(findGreeting(validation.date), 200);
  }

  return c.json(findGreeting(new Date()), 200);
}
