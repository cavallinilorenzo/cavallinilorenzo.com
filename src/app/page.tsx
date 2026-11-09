import Link from "next/link";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { GitLog } from "@/components/GitLog";
import { CV_HREF } from "@/components/Header";
import { PageTransition } from "@/components/PageTransition";
import { COPY, PAGES } from "@/content/copy";
import { EMAIL, MAILTO } from "@/lib/email";
import styles from "./home.module.css";

export const metadata = {
  title: { absolute: PAGES.home.title },
  description: PAGES.home.description,
};

function Marked({ children }: { children: string }) {
  return (
    <span className={styles.mark}>
      <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M6 10C70 4 210 2 294 7C298 28 296 66 299 90C212 97 84 95 3 93C7 70 3 34 6 10Z" />
      </svg>
      {children}
    </span>
  );
}

export default function Home() {
  const [first, firstRest, second, secondRest] = COPY.home.h1;
  return (
    <PageTransition>
      <section className={styles.hero}>
        <div className={styles.avail}>{COPY.home.avail}</div>
        <h1 className={styles.big}>
          <span className={styles.line}>
            <span className={styles.lineIn}>
              <Marked>{first}</Marked>
              <br className={styles.mobileBreak} />
              {firstRest}
            </span>
          </span>
          <span className={styles.line}>
            <span className={styles.lineIn}>
              <Marked>{second}</Marked>
              <br className={styles.mobileBreak} />
              {secondRest}
            </span>
          </span>
        </h1>
        <p className={styles.sub}>{COPY.home.intro}</p>
        <div className={styles.cta}>
          <Link href="/projects">{COPY.home.ctaProjects} →</Link>
          <a href={CV_HREF} download>
            ↓ {COPY.ui.cv}
          </a>
          <CopyEmailButton className={styles.textButton} />
        </div>
      </section>

      <GitLog />

      <section className={styles.contact} aria-labelledby="contact">
        <div className={styles.contactIn}>
          <h2 id="contact">{COPY.freelance.endQ}</h2>
          <a className={styles.write} href={MAILTO}>
            {COPY.freelance.write} →
          </a>
          <ul>
            {COPY.links.items.map((l) => (
              <li key={l.id}>
                <code>{l.id}</code>
                <a href={"url" in l ? `https://${l.url}` : MAILTO}>
                  {"url" in l ? l.url : EMAIL}
                </a>
                <span>{l.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageTransition>
  );
}
