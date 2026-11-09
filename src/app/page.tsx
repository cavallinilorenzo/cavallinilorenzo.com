import Link from "next/link";
import button from "@/components/Button.module.css";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { CV_HREF } from "@/components/Header";
import { ProjectGrid } from "@/components/ProjectCard";
import { COPY, PAGES } from "@/content/copy";
import { PROJECTS } from "@/content/projects";
import styles from "./home.module.css";
import { PageTransition } from "@/components/PageTransition";

export const metadata = {
  title: { absolute: PAGES.home.title },
  description: PAGES.home.description,
};

export default function Home() {
  const [a, b, accent, c] = COPY.home.h1;
  return (
    <PageTransition>
      <section className={styles.hero}>
        <div className={styles.avail}>
          <span className={styles.dot} />
          {COPY.home.avail}
        </div>
        <h1 className={styles.big}>
          {a}
          <br />
          {b}
          <span className={styles.accent}>{accent}</span>
          {c}
        </h1>
        <p className={styles.sub}>{COPY.home.intro}</p>
        <div className={styles.cta}>
          <Link className={`${button.btn} ${button.primary}`} href="/projects">
            {COPY.home.ctaProjects} →
          </Link>
          <a className={button.btn} href={CV_HREF} download>
            ↓ {COPY.ui.cv}
          </a>
          <CopyEmailButton />
        </div>
      </section>
      <section aria-labelledby="selected">
        <div className={styles.sechead}>
          <h2 id="selected">{COPY.home.selected}</h2>
          <Link href="/projects">{COPY.home.all} →</Link>
        </div>
        <ProjectGrid projects={PROJECTS} />
      </section>
    </PageTransition>
  );
}
