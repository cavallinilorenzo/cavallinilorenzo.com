import Image from "next/image";
import Link from "next/link";
import { arrowFor, displayUrl, hrefFor, type Project } from "@/lib/project";
import styles from "./ProjectCard.module.css";

export function ProjectCard({ project }: { project: Project }) {
  const href = hrefFor(project);
  const inner = (
    <>
      <div className={styles.top}>
        <Image
          className={`${styles.ico} ${project.icon.padded ? styles.pad : ""}`}
          src={project.icon.src}
          width={48}
          height={48}
          alt=""
          unoptimized
        />
        <h3>{project.name}</h3>
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
  return project.destination.kind === "page" ? (
    <Link className={styles.card} href={href} data-testid="project-card">
      {inner}
    </Link>
  ) : (
    <a className={styles.card} href={href} data-testid="project-card">
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
