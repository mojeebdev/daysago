export type Shocker = {
  slug: string;
  label: string;
  date: string; // ISO date, UTC midnight
};

// Pre-loaded "shockers" — pick durable, universally-known reference points,
// not fast-decaying pop culture that ages out of relatability.
export const SHOCKERS: Shocker[] = [
  { slug: "2020", label: "2020", date: "2020-01-01" },
  { slug: "2010s-ended", label: "the 2010s ended", date: "2020-01-01" },
  { slug: "first-iphone", label: "the first iPhone was announced", date: "2007-01-09" },
  { slug: "y2k", label: "Y2K", date: "2000-01-01" },
];

// ---------------------------------------------------------------------
// The hero counter is deliberately NOT "true days since Jan 1, 2020" —
// that number keeps climbing past the original tweet's premise. Instead
// it's anchored: pick the value it should show on ship day, and it ticks
// up by exactly 1 at every UTC midnight after that, forever in sync with
// "2020 was 2020 days ago, and tomorrow it's 2021."
//
// Set ANCHOR_DATE to the day you deploy/want the count to read ANCHOR_VALUE.
export const ANCHOR_DATE = "2026-07-12";
export const ANCHOR_VALUE = 2020;

export type AnchoredBreakdown = {
  value: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function anchoredValue(
  anchorDate: string,
  anchorValue: number,
  now: Date = new Date()
): AnchoredBreakdown {
  const start = new Date(`${anchorDate}T00:00:00Z`).getTime();
  const totalMs = Math.max(0, now.getTime() - start);

  const daysElapsed = Math.floor(totalMs / 86_400_000);
  const remainderMs = totalMs - daysElapsed * 86_400_000;
  const hours = Math.floor(remainderMs / 3_600_000);
  const minutes = Math.floor((remainderMs % 3_600_000) / 60_000);
  const seconds = Math.floor((remainderMs % 60_000) / 1000);

  return { value: anchorValue + daysElapsed, hours, minutes, seconds };
}

export type Breakdown = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * Elapsed time between an ISO date (assumed UTC midnight, i.e. "that day")
 * and now. Returns whole days plus the remainder as h/m/s for the live tick.
 */
export function elapsedSince(isoDate: string, now: Date = new Date()): Breakdown {
  const start = new Date(`${isoDate}T00:00:00Z`).getTime();
  const totalMs = Math.max(0, now.getTime() - start);

  const days = Math.floor(totalMs / 86_400_000);
  const remainderMs = totalMs - days * 86_400_000;
  const hours = Math.floor(remainderMs / 3_600_000);
  const minutes = Math.floor((remainderMs % 3_600_000) / 60_000);
  const seconds = Math.floor((remainderMs % 60_000) / 1000);

  return { totalMs, days, hours, minutes, seconds };
}

export function formatDayLabel(input: string): string {
  const d = new Date(`${input}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Pad a number to a fixed digit width, e.g. for split-flap groups. */
export function padDigits(n: number, width: number): string {
  return Math.max(0, Math.trunc(n)).toString().padStart(width, "0");
}
