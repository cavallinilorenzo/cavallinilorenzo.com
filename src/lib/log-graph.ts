// Geometry of the commit graph on Home. Pure on purpose: the lanes come from
// the Timeline data, so a new entry redraws the graph with no extra work.
// Rows are newest first, so a branch starts at its highest row index.

export type GraphRow = {
  id: string;
  type: "edu" | "work" | "hack" | "proj";
  start: string;
  end?: string;
  ongoing?: boolean;
};

export type Branch = {
  lane: number;
  /** Row where the branch stops; -1 when it is still open at the top. */
  top: number;
  bottom: number;
  /** Closed without merging: drawn with a cross. */
  capped: boolean;
};

export type GraphLayout = {
  last: number;
  branches: Branch[];
  /** A short branch that forks and merges within its own row. */
  stubs: { lane: number; row: number }[];
};

export type GraphLine = {
  lane: number;
  top: number;
  /** Distance from the row's bottom, or the y at which the line stops. */
  bottom: number | { stopAt: number };
};

export type RowGraph = {
  lines: GraphLine[];
  paths: string[];
  caps: { x: number; y: number }[];
  node: { x: number; y: number; r: number; hollow: boolean };
  height: number;
};

const GAP = 16;
/** Horizontal centre of a lane, in px. */
export const laneX = (lane: number) => 8 + lane * GAP;
export const GRAPH_WIDTH = laneX(3) + 14;
/** Height of a row collapsed by the filter. */
export const COMPACT_ROW = 34;

const METRICS = {
  full: { node: 46, drop: 34, cap: 26, stub: 6 },
  compact: { node: 17, drop: 13, cap: 9, stub: 3 },
};

export function laneOf(row: GraphRow): number {
  if (row.type === "edu") return 1;
  if (row.type === "work") return 2;
  if (row.type === "proj" && row.end) return 3;
  return 0;
}

export function layoutGraph(rows: readonly GraphRow[]): GraphLayout {
  const branches: Branch[] = [];
  const stubs: GraphLayout["stubs"] = [];

  // Education is one continuous branch from its oldest entry.
  const edu = rows.flatMap((r, i) => (r.type === "edu" ? [i] : []));
  if (edu.length > 0) {
    branches.push({
      lane: 1,
      top: rows.some((r) => r.type === "edu" && r.ongoing) ? -1 : edu[0],
      bottom: edu[edu.length - 1],
      capped: false,
    });
  }

  rows.forEach((row, i) => {
    if (row.type === "work") {
      if (row.ongoing)
        branches.push({ lane: 2, top: -1, bottom: i, capped: false });
      else stubs.push({ lane: 2, row: i });
    }
    if (row.type === "proj" && row.end) {
      let top = 0;
      for (let k = i - 1; k >= 0; k--) {
        if (rows[k].start >= row.end) {
          top = k;
          break;
        }
      }
      branches.push({ lane: 3, top, bottom: i, capped: true });
    }
  });

  return { last: rows.length - 1, branches, stubs };
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const m = (y1 + y2) / 2;
  return `M${x1} ${y1}C${x1} ${m} ${x2} ${m} ${x2} ${y2}`;
}

export function graphFor(
  layout: GraphLayout,
  row: GraphRow,
  index: number,
  compact: boolean,
): RowGraph {
  const m = compact ? METRICS.compact : METRICS.full;
  const lines: GraphLine[] = [
    {
      lane: 0,
      top: 0,
      bottom: index === layout.last ? { stopAt: m.node + m.drop } : 0,
    },
  ];
  const paths: string[] = [];
  const caps: RowGraph["caps"] = [];

  for (const b of layout.branches) {
    if (index === b.bottom) {
      lines.push({ lane: b.lane, top: 0, bottom: { stopAt: m.node } });
      paths.push(curve(laneX(0), m.node + m.drop, laneX(b.lane), m.node));
    } else if (index === b.top) {
      lines.push({ lane: b.lane, top: m.node + m.cap, bottom: 0 });
      if (b.capped) caps.push({ x: laneX(b.lane), y: m.node + m.cap });
    } else if (index < b.bottom && index > b.top) {
      lines.push({ lane: b.lane, top: 0, bottom: 0 });
    }
  }

  for (const s of layout.stubs) {
    if (s.row !== index) continue;
    const x = laneX(s.lane);
    paths.push(
      `${curve(laneX(0), m.node + m.drop, x, m.node + m.stub)}V${m.node - m.stub}`,
      curve(x, m.node - m.stub, laneX(0), m.node - m.drop),
    );
  }

  const big = row.type === "proj";
  return {
    lines,
    paths,
    caps,
    node: {
      x: laneX(laneOf(row)),
      y: m.node,
      r: compact ? 3.5 : big ? 8 : 5,
      hollow: row.type === "hack",
    },
    height: m.node + m.drop + 10,
  };
}
