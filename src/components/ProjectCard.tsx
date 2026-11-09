import Image from "next/image";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import {
  arrowFor,
  displayUrl,
  hrefFor,
  morphNames,
  type Project,
} from "@/lib/project";
import styles from "./ProjectCard.module.css";

export function ProjectCard({
  project,
  lead,
  flush,
}: {
  project: Project;
  /** Shown before the status, e.g. the refs of a log row. */
  lead?: ReactNode;
  /** Drop the card's own padding when its container already has some. */
  flush?: boolean;
}) {
  const href = hrefFor(project);
  // Only a Project with its own page morphs; it shares names with that page.
  const morph = project.destination.kind === "page" && morphNames(project);
  const icon = (
    <Image
      className={`${styles.ico} ${project.icon.padded ? styles.pad : ""}`}
      src={project.icon.src}
      width={84}
      height={84}
      alt=""
      unoptimized
    />
  );
  const name = <h3>{project.name}</h3>;
  const inner = (
    <>
      {lead}
      <span
        className={styles.badge}
        data-closed={project.status === "Closed" || undefined}
      >
        {project.status}
      </span>
      <div className={styles.head}>
        {morph ? (
          <ViewTransition name={morph.icon} share="morph" default="none">
            {icon}
          </ViewTransition>
        ) : (
          icon
        )}
        {morph ? (
          <ViewTransition name={morph.name} share="morph" default="none">
            {name}
          </ViewTransition>
        ) : (
          name
        )}
      </div>
      <p>{project.short}</p>
      <div className={styles.foot}>
        <span>
          {project.platform} · {project.stack}
        </span>
        <span className={styles.url}>
          {displayUrl(project)}{" "}
          <span className={styles.arrow}>{arrowFor(project)}</span>
        </span>
      </div>
    </>
  );
  const className = `${styles.card} ${flush ? styles.flush : ""}`;
  const attrs = { "data-testid": "project-card", "data-reveal": "card" };
  return project.destination.kind === "page" ? (
    <Link className={className} href={href} {...attrs}>
      {inner}
    </Link>
  ) : (
    <a className={className} href={href} {...attrs}>
      {inner}
    </a>
  );
}

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <div className={styles.list} data-testid="project-grid">
      {projects.map((p) => (
        <div className={styles.band} key={p.id}>
          <div className={styles.bandIn}>
            <ProjectCard project={p} />
          </div>
        </div>
      ))}
    </div>
  );
}
