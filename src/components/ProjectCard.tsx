import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import {
  arrowFor,
  displayUrl,
  hrefFor,
  morphNames,
  type Project,
} from "@/lib/project";
import styles from "./ProjectCard.module.css";

export function ProjectCard({ project }: { project: Project }) {
  const href = hrefFor(project);
  // Only a Project with its own page morphs; it shares names with that page.
  const morph = project.destination.kind === "page" && morphNames(project);
  const icon = (
    <Image
      className={`${styles.ico} ${project.icon.padded ? styles.pad : ""}`}
      src={project.icon.src}
      width={48}
      height={48}
      alt=""
      unoptimized
    />
  );
  const name = <h3>{project.name}</h3>;
  const inner = (
    <>
      <div className={styles.top}>
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
        <span
          className={styles.badge}
          data-closed={project.status === "Closed" || undefined}
        >
          {project.status}
        </span>
      </div>
      <p>{project.short}</p>
      <div className={styles.url}>
        <span>{displayUrl(project)}</span>
        <span className={styles.arrow}>{arrowFor(project)}</span>
      </div>
    </>
  );
  const attrs = {
    "data-testid": "project-card",
    "data-reveal": "card",
    "data-glow": "",
  };
  return project.destination.kind === "page" ? (
    <Link className={styles.card} href={href} {...attrs}>
      {inner}
    </Link>
  ) : (
    <a className={styles.card} href={href} {...attrs}>
      {inner}
    </a>
  );
}

export function ProjectGrid({ projects }: { projects: readonly Project[] }) {
  return (
    <div className={styles.grid} data-testid="project-grid">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
