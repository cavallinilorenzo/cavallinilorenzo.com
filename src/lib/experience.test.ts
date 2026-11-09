import { describe, expect, it } from "vitest";
import { TIMELINE } from "../content/experience";
import {
  formatLength,
  formatMonth,
  formatRange,
  orderEntries,
  type TimelineEntry,
} from "./experience";

const TODAY = "2026-11";
const e = (p: Partial<TimelineEntry>): TimelineEntry => ({
  id: "x",
  type: "work",
  start: "2026",
  ...p,
});

describe("formatMonth", () => {
  it("names the month and leaves a bare year alone", () => {
    expect(formatMonth("2026-10")).toBe("Oct 2026");
    expect(formatMonth("2024")).toBe("2024");
  });
});

describe("orderEntries", () => {
  it("puts Ongoing first, then end date newest first, stable on ties", () => {
    const ids = orderEntries(TIMELINE, TODAY).map((t) => t.id);
    expect(ids).toEqual([
      "freelance",
      "uni",
      "oxide",
      "acquam",
      "overload",
      "gnam",
      "icib",
      "sciotem26",
      "sciotem25",
      "diploma",
      "adami",
    ]);
  });

  it("does not mutate its input", () => {
    const copy = [...TIMELINE];
    orderEntries(TIMELINE, TODAY);
    expect(TIMELINE).toEqual(copy);
  });
});

describe("formatRange", () => {
  it("shows only the year for a single moment", () => {
    expect(formatRange(e({ start: "2026-09" }))).toEqual({
      text: "2026",
      ongoing: false,
    });
  });
  it("marks Ongoing with Present", () => {
    expect(formatRange(e({ start: "2024", ongoing: true }))).toEqual({
      text: "2024 — Present",
      ongoing: true,
      from: "2024",
    });
  });
  it("shows a finished range by years", () => {
    expect(formatRange(e({ start: "2019", end: "2024" })).text).toBe(
      "2019 — 2024",
    );
  });
  it("collapses a range inside one year", () => {
    expect(formatRange(e({ start: "2023-06", end: "2023-07" })).text).toBe(
      "2023",
    );
  });
});

describe("formatLength", () => {
  it("is empty for a single moment", () => {
    expect(formatLength(e({ start: "2026-09" }), TODAY)).toBe("");
  });
  it("counts whole years for Ongoing year dates", () => {
    expect(formatLength(e({ start: "2024", ongoing: true }), TODAY)).toBe(
      "2 yrs so far",
    );
  });
  it("counts inclusive months for Ongoing month dates", () => {
    expect(formatLength(e({ start: "2026-02", ongoing: true }), TODAY)).toBe(
      "10 mo so far",
    );
  });
  it("counts whole years for a finished range", () => {
    expect(formatLength(e({ start: "2019", end: "2024" }), TODAY)).toBe(
      "5 yrs",
    );
  });
  it("counts inclusive months for a finished range", () => {
    expect(formatLength(e({ start: "2023-06", end: "2023-07" }), TODAY)).toBe(
      "2 mo",
    );
    expect(formatLength(e({ start: "2026-02", end: "2026-07" }), TODAY)).toBe(
      "6 mo",
    );
  });
  it("switches to years and months from 12 months up", () => {
    expect(formatLength(e({ start: "2025-02", ongoing: true }), TODAY)).toBe(
      "1 yr 10 mo so far",
    );
    expect(formatLength(e({ start: "2025-11", end: "2026-10" }), TODAY)).toBe(
      "1 yr",
    );
  });
});
