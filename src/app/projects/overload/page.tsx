import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Link from "next/link";
import button from "@/components/Button.module.css";
import { OVERLOAD_PAGE } from "@/content/copy";
import Prose from "@/content/overload.mdx";
import { PROJECTS } from "@/content/projects";
import { factsFor, findPageProject } from "@/lib/facts";
import styles from "./overload.module.css";

export const metadata = {
  title: { absolute: OVERLOAD_PAGE.title },
  description: OVERLOAD_PAGE.description,
};

// Screenshots are supplied later; until the file exists the frame stays an
// empty neutral placeholder. Checked at build time, so the page stays static.
const shotExists = (src: string) =>
  existsSync(join(process.cwd(), "public", src));

export default function OverloadPage() {
  const p = findPageProject(PROJECTS, "overload");
  const { tagline, cta, screenshots } = p.destination;
  return (
    <>
      <Link className={styles.crumb} href="/projects">
        ← Projects
      </Link>
      <div className={styles.hero}>
        <Image
          className={styles.ico}
          src={p.icon.src}
          width={88}
          height={88}
          alt=""
          unoptimized
        />
        <div>
          <h1>{p.name}</h1>
          <p>{tagline}</p>
        </div>
        <a
          className={`${button.btn} ${button.primary} ${styles.cta}`}
          href={cta.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cta.label} ↗
        </a>
      </div>
      <div className={styles.shots} data-testid="screenshots">
        {screenshots.map((s, i) => (
          <div className={styles.phone} data-frame={s.frame} key={s.src}>
            {shotExists(s.src) ? (
              <Image
                src={s.src}
                alt={`${p.name} screenshot ${i + 1}`}
                width={390}
                height={844}
                unoptimized
              />
            ) : (
              <span aria-hidden="true">screenshot</span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.split}>
        <div className={styles.prose}>
          <Prose />
        </div>
        <dl className={styles.facts} data-testid="facts">
          {factsFor(p).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
