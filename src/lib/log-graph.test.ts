import { describe, expect, it } from "vitest";
import {
  COMPACT_ROW,
  graphFor,
  laneOf,
  laneX,
  layoutGraph,
  type GraphRow,
} from "./log-graph";

// The real shape of the Timeline, newest first.
const ROWS: GraphRow[] = [
  { id: "oxide", type: "proj", start: "2026-10" },
  { id: "overload", type: "proj", start: "2026-07" },
  { id: "clicky", type: "proj", start: "2026" },
  { id: "gnam", type: "proj", start: "2026-02", end: "2026-07" },
  { id: "freelance", type: "work", start: "2026-02", ongoing: true },
  { id: "hack", type: "hack", start: "2025-02" },
  { id: "uni", type: "edu", start: "2024", ongoing: true },
  { id: "adami", type: "work", start: "2023-06", end: "2023-07" },
  { id: "diploma", type: "edu", start: "2019", end: "2024" },
];
const at = (id: string) => ROWS.findIndex((r) => r.id === id);
const layout = layoutGraph(ROWS);

describe("laneOf", () => {
  it("keeps shipped work on main and branches the rest", () => {
    expect(laneOf(ROWS[at("oxide")])).toBe(0);
    expect(laneOf(ROWS[at("hack")])).toBe(0);
    expect(laneOf(ROWS[at("uni")])).toBe(1);
    expect(laneOf(ROWS[at("freelance")])).toBe(2);
    expect(laneOf(ROWS[at("gnam")])).toBe(3);
  });
});

describe("layoutGraph", () => {
  it("draws education as one branch still open at the top", () => {
    expect(layout.branches).toContainEqual({
      lane: 1,
      top: -1,
      bottom: at("diploma"),
      capped: false,
    });
  });

  it("keeps ongoing work open at the top", () => {
    expect(layout.branches).toContainEqual({
      lane: 2,
      top: -1,
      bottom: at("freelance"),
      capped: false,
    });
  });

  it("closes GNAM! without merging at the first row after its end", () => {
    expect(layout.branches).toContainEqual({
      lane: 3,
      top: at("overload"),
      bottom: at("gnam"),
      capped: true,
    });
  });

  it("turns finished work into a stub on its own row", () => {
    expect(layout.stubs).toEqual([{ lane: 2, row: at("adami") }]);
  });
});

describe("graphFor", () => {
  const draw = (id: string, compact = false) =>
    graphFor(layout, ROWS[at(id)], at(id), compact);

  it("runs main through every row and stops it at the root", () => {
    expect(draw("oxide").lines[0]).toEqual({ lane: 0, top: 0, bottom: 0 });
    expect(draw("diploma").lines[0].bottom).toEqual({ stopAt: 80 });
  });

  it("puts the cross where a closed branch ends", () => {
    expect(draw("overload").caps).toEqual([{ x: laneX(3), y: 72 }]);
    expect(draw("oxide").caps).toEqual([]);
  });

  it("does not draw a closed branch above its end", () => {
    expect(draw("oxide").lines.map((l) => l.lane)).toEqual([0, 1, 2]);
  });

  it("marks hackathons with a hollow node", () => {
    expect(draw("hack").node.hollow).toBe(true);
    expect(draw("oxide").node.hollow).toBe(false);
  });

  it("fits every compact row inside its height", () => {
    for (const r of ROWS) {
      const g = draw(r.id, true);
      expect(g.node.y + g.node.r).toBeLessThanOrEqual(COMPACT_ROW);
      expect(g.height).toBeLessThanOrEqual(COMPACT_ROW + 10);
    }
  });
});
