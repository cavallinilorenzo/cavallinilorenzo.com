import Link from "next/link";
import { CV_HREF } from "@/components/Header";
import { COPY, PAGES } from "@/content/copy";
import styles from "./home.module.css";

export const metadata = {
  title: { absolute: PAGES.home.title },
  description: PAGES.home.description,
};

export default function Home() {
  const [a, b, accent, c] = COPY.home.h1;
  return (
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
        <Link className={`${styles.btn} ${styles.primary}`} href="/projects">
          {COPY.home.ctaProjects} →
        </Link>
        <a className={styles.btn} href={CV_HREF} download>
          ↓ {COPY.ui.cv}
        </a>
      </div>
    </section>
  );
}
