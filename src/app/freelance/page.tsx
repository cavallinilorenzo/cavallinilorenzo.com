import button from "@/components/CopyEmail.module.css";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { CheckIcon, LockIcon, ServiceIcon } from "@/components/glyphs";
import { PageIntro } from "@/components/PageIntro";
import { COPY, PAGES } from "@/content/copy";
import { MAILTO } from "@/lib/email";
import styles from "./freelance.module.css";
import { PageTransition } from "@/components/PageTransition";

export const metadata = {
  title: { absolute: PAGES.freelance.title },
  description: PAGES.freelance.description,
};

export default function FreelancePage() {
  const f = COPY.freelance;
  return (
    <PageTransition>
      <PageIntro title={f.title} intro={f.intro} />

      <div className={styles.stats} data-testid="stats">
        {f.stats.map(([value, label]) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className={styles.block}>
        <h2 className={styles.h2}>{f.what}</h2>
        <p className={styles.h2sub}>{f.whatSub}</p>
        <div className={styles.services} data-testid="services">
          {f.services.map((s) => (
            <div key={s.id}>
              <span className={styles.si}>
                <ServiceIcon name={s.id} />
              </span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.h2}>{f.clientsTitle}</h2>
        <p className={styles.h2sub}>{f.clientsSub}</p>
        <div className={styles.cases}>
          {f.clients.map((c) => (
            <article key={c.id} className={styles.card} data-testid="client">
              <div className={styles.head}>
                <span className={styles.ci}>
                  <ServiceIcon name={c.id} />
                </span>
                <div>
                  <h3>{c.name}</h3>
                  <div className={styles.kind}>{c.kind}</div>
                </div>
              </div>
              <p className={styles.sum}>{c.summary}</p>
              <ul className={styles.list}>
                {c.items.map(([title, desc]) => (
                  <li key={title}>
                    <CheckIcon />
                    <div>
                      <b>{title}</b>
                      <span>{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <ul className={styles.stack}>
                {c.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className={styles.anon}>
          <LockIcon />
          {f.anon}
        </p>
      </section>

      <div className={styles.band}>
        <h2>{f.endQ}</h2>
        <p>
          <span className={styles.dot} aria-hidden="true" />
          {f.endAvail}
        </p>
        <div className={styles.cta}>
          <a href={MAILTO} className={`${button.btn} ${button.primary}`}>
            {f.write} →
          </a>
          <CopyEmailButton />
        </div>
      </div>
    </PageTransition>
  );
}
