"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { COPY } from "@/content/copy";
import {
  PLACE_LABEL,
  TIMELINE,
  TYPE_LABEL,
  type ExperienceEntry,
} from "@/content/experience";
import { PROJECTS } from "@/content/projects";
import { formatMonth } from "@/lib/experience";
import { GRAPH_WIDTH, graphFor, laneX, layoutGraph } from "@/lib/log-graph";
import { commitHash } from "@/lib/commit-hash";
import { ProjectCard } from "./ProjectCard";
import styles from "./GitLog.module.css";

// Clicky.rs is a Project without a Timeline entry: the log is the one place
// that needs it, next to the other 2026 launches.
const CLICKY: ExperienceEntry = {
  id: "clicky",
  start: "2026",
  type: "proj",
  project: "clicky",
  title: "Clicky.rs",
  org: "",
  text: "",
};
const OVERLOAD_AT = TIMELINE.findIndex((e) => e.id === "overload");
const ROWS: readonly ExperienceEntry[] = [
  ...TIMELINE.slice(0, OVERLOAD_AT + 1),
  CLICKY,
  ...TIMELINE.slice(OVERLOAD_AT + 1),
];
const LAYOUT = layoutGraph(ROWS);

const FILTERS = [["all", "All"], ...Object.entries(TYPE_LABEL)] as const;

function dateRange(e: ExperienceEntry): string {
  if (e.ongoing) return `${formatMonth(e.start)} – now`;
  if (e.end) return `${formatMonth(e.start)} – ${formatMonth(e.end)}`;
  return formatMonth(e.start);
}

function Graph({
  entry,
  row,
  compact,
}: {
  entry: ExperienceEntry;
  row: number;
  compact: boolean;
}) {
  const g = graphFor(LAYOUT, entry, row, compact);
  return (
    <div className={styles.graph} aria-hidden="true" data-testid="graph">
      {g.lines.map((l, i) => (
        <span
          key={i}
          className={styles.lane}
          style={{
            left: laneX(l.lane) - 1,
            top: l.top,
            bottom:
              typeof l.bottom === "number"
                ? l.bottom
                : `calc(100% - ${l.bottom.stopAt}px)`,
          }}
        />
      ))}
      <svg height={g.height} width={GRAPH_WIDTH}>
        {g.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {g.caps.map((c) => (
          <path
            key={c.x}
            d={`M${c.x - 5} ${c.y - 5}l10 10m0-10l-10 10`}
            strokeWidth="2.5"
          />
        ))}
        <circle
          cx={g.node.x}
          cy={g.node.y}
          r={g.node.r}
          className={g.node.hollow ? styles.ring : styles.dot}
        />
      </svg>
    </div>
  );
}

function Refs({ refs }: { refs: [label: string, important: boolean][] }) {
  if (refs.length === 0) return null;
  return (
    <div className={styles.refs}>
      {refs.map(([label, important]) => (
        <span key={label} data-important={important || undefined}>
          {label}
        </span>
      ))}
    </div>
  );
}

function refsFor(e: ExperienceEntry, row: number) {
  const refs: [string, boolean][] = [];
  if (row === 0) refs.push(["HEAD → main", true]);
  if (e.place) refs.push([`tag: ${PLACE_LABEL[e.place]}`, e.place === 1]);
  if (e.ongoing)
    refs.push([e.type === "edu" ? "education" : "freelance", true]);
  return refs;
}

function FreelanceDetail() {
  const f = COPY.freelance;
  return (
    <div className={styles.show}>
      <p className={styles.showIntro}>{f.intro}</p>
      <div className={styles.stats}>
        {f.stats.map(([value, label]) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className={styles.services}>
        {f.services.map((s) => (
          <div key={s.id}>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
      {f.clients.map((c) => (
        <div className={styles.client} key={c.id}>
          <div className={styles.clientHead}>
            <h4>{c.name}</h4>
            <span>{c.kind}</span>
          </div>
          <p>{c.summary}</p>
          <ul>
            {c.items.map(([title, desc]) => (
              <li key={title}>
                <span aria-hidden="true">+</span>
                <div>
                  <b>{title}</b> {desc}
                </div>
              </li>
            ))}
          </ul>
          <code>{c.stack.join(" · ")}</code>
        </div>
      ))}
      <p className={styles.anon}>{f.anon}</p>
    </div>
  );
}

function Row({
  e,
  row,
  compact,
}: {
  e: ExperienceEntry;
  row: number;
  compact: boolean;
}) {
  const project = PROJECTS.find((p) => p.id === e.project);
  const freelance = e.id === "freelance";

  if (compact)
    return (
      <article className={styles.compact} data-testid="log-row" data-compact>
        <div className={styles.inner}>
          <Graph entry={e} row={row} compact />
          <div className={styles.line}>
            <code>{commitHash(e.id)}</code>
            <span>{project?.name ?? e.title}</span>
            <time>{dateRange(e)}</time>
          </div>
        </div>
      </article>
    );

  const refs = refsFor(e, row);
  return (
    <article
      className={project ? styles.band : freelance ? styles.pale : undefined}
      data-testid="log-row"
    >
      <div className={styles.inner}>
        <Graph entry={e} row={row} compact={false} />
        <div className={styles.content}>
          <div className={styles.meta}>
            <code>{commitHash(e.id)}</code>
            <span>{dateRange(e)}</span>
            <span>{TYPE_LABEL[e.type]}</span>
          </div>
          <div className={styles.main}>
            {project ? (
              <ProjectCard
                project={project}
                flush
                lead={refs.length > 0 ? <Refs refs={refs} /> : undefined}
              />
            ) : (
              <>
                <Refs refs={refs} />
                <h3 className={styles.title}>{e.title}</h3>
                <small>{e.org}</small>
                <p>{e.text}</p>
                {freelance && <FreelanceDetail />}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Home's body: every Timeline entry and Project as one commit graph. */
export function GitLog() {
  const [filter, setFilter] = useState("all");
  const top = useRef<HTMLDivElement>(null);

  const choose = (key: string) => {
    const apply = () => {
      flushSync(() => setFilter(key));
      // The list changes height: keep its start right under the sticky bar.
      const y = top.current!.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > y) window.scrollTo({ top: y, behavior: "instant" });
    };
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
  };

  return (
    <div className={styles.root}>
      <h2 className={styles.srOnly}>{COPY.home.selected}</h2>
      <div ref={top} />
      <div className={styles.filter} role="group" aria-label="Filter the log">
        <code>log --graph</code>
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => choose(key)}
          >
            {label}
          </button>
        ))}
      </div>
      {ROWS.map((e, i) => (
        <Row
          key={e.id}
          e={e}
          row={i}
          compact={filter !== "all" && filter !== e.type}
        />
      ))}
    </div>
  );
}
