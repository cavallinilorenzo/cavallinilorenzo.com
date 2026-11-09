// Pure rules of the Experience timeline: order, range and length labels.
// Dates are "YYYY" or "YYYY-MM". "Today" is passed in ("YYYY-MM"), the build
// date in the page, so these stay deterministic.

export type EntryType = "edu" | "work" | "hack" | "proj";

export type TimelineEntry = {
  id: string;
  type: EntryType;
  start: string;
  /** Absent: a single moment (or Ongoing, see below). */
  end?: string;
  /** No end yet. */
  ongoing?: boolean;
};

const monthIndex = (date: string) => {
  const [y, m] = date.split("-");
  return Number(y) * 12 + (m ? Number(m) - 1 : 0);
};
const year = (date: string) => date.slice(0, 4);
const hasMonth = (date: string) => date.includes("-");

const endOf = (e: TimelineEntry, today: string) =>
  e.ongoing ? today : (e.end ?? e.start);

export function orderEntries<T extends TimelineEntry>(
  entries: readonly T[],
  today: string,
): T[] {
  return [...entries].sort(
    (a, b) =>
      Number(!!b.ongoing) - Number(!!a.ongoing) ||
      monthIndex(endOf(b, today)) - monthIndex(endOf(a, today)),
  );
}

export type RangeLabel = {
  text: string;
  ongoing: boolean;
  /** For Ongoing entries: the part before "Present", so it can be styled. */
  from?: string;
};

export function formatRange(e: TimelineEntry): RangeLabel {
  const from = year(e.start);
  if (e.ongoing) return { text: `${from} — Present`, ongoing: true, from };
  if (e.end === undefined) return { text: from, ongoing: false };
  const to = year(e.end);
  return { text: from === to ? from : `${from} — ${to}`, ongoing: false };
}

const years = (n: number) => (n === 1 ? "1 yr" : `${n} yrs`);

function span(e: TimelineEntry, today: string): string {
  const end = endOf(e, today);
  if (!hasMonth(e.start) || !hasMonth(end)) {
    const n = Number(year(end)) - Number(year(e.start));
    return n < 1 ? "" : years(n);
  }
  const n = monthIndex(end) - monthIndex(e.start) + 1;
  if (n < 12) return `${n} mo`;
  const rest = n % 12;
  return years(Math.floor(n / 12)) + (rest ? ` ${rest} mo` : "");
}

export function formatLength(e: TimelineEntry, today: string): string {
  if (!e.ongoing && e.end === undefined) return "";
  const s = span(e, today);
  return s && e.ongoing ? `${s} so far` : s;
}
