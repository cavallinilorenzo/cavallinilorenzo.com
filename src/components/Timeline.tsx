import Image from "next/image";
import Link from "next/link";
import {
  PLACE_LABEL,
  TYPE_LABEL,
  type ExperienceEntry,
  type Glyph,
} from "@/content/experience";
import { PROJECTS } from "@/content/projects";
import { formatLength, formatRange, orderEntries } from "@/lib/experience";
import styles from "./Timeline.module.css";

const PATHS: Record<Glyph, React.ReactNode> = {
  cap: (
    <>
      <path d="M2 9.5 12 4.5l10 5-10 5z" />
      <path d="M6 11.5v4.5c3.5 2.5 8.5 2.5 12 0v-4.5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6H5.5a2.5 2.5 0 0 0 2.7 3.6M16 6h2.5a2.5 2.5 0 0 1-2.7 3.6M12 13v4M8.5 20h7" />
    </>
  ),
  bag: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" />
    </>
  ),
  tool: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  school: <path d="M3 21h18M5 21V9.5l7-5 7 5V21M10 21v-5h4v5" />,
};

function GlyphIcon({ name }: { name: Glyph }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

function Tile({ entry }: { entry: ExperienceEntry }) {
  const project = entry.project
    ? PROJECTS.find((p) => p.id === entry.project)
    : undefined;
  return (
    <span className={styles.tile}>
      {project ? (
        <Image
          className={project.icon.padded ? styles.pad : undefined}
          src={project.icon.src}
          width={44}
          height={44}
          alt=""
          unoptimized
        />
      ) : entry.glyph ? (
        <GlyphIcon name={entry.glyph} />
      ) : null}
    </span>
  );
}

export function Timeline({
  entries,
  today,
}: {
  entries: readonly ExperienceEntry[];
  today: string;
}) {
  return (
    <ol className={styles.rail} data-testid="timeline">
      {orderEntries(entries, today).map((e) => {
        const range = formatRange(e);
        const length = formatLength(e, today);
        const external = e.link?.href.startsWith("http");
        return (
          <li
            key={e.id}
            className={styles.item}
            data-ongoing={e.ongoing || undefined}
            data-testid="entry"
            data-reveal
          >
            <div className={styles.range} data-testid="range">
              {range.ongoing ? (
                <>
                  {range.from} — <span className={styles.present}>Present</span>
                </>
              ) : (
                range.text
              )}
              {length && <small>{length}</small>}
            </div>
            <Tile entry={e} />
            <div className={styles.body}>
              <h3>
                {e.title}
                {e.place && (
                  <span className={styles.win}>🏆 {PLACE_LABEL[e.place]}</span>
                )}
              </h3>
              <div className={styles.org}>
                {TYPE_LABEL[e.type]} · {e.org}
              </div>
              <p>{e.text}</p>
              {e.link &&
                (external ? (
                  <a
                    className={styles.link}
                    href={e.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {e.link.label} ↗
                  </a>
                ) : (
                  <Link className={styles.link} href={e.link.href}>
                    {e.link.label} →
                  </Link>
                ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
