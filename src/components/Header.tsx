"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COPY } from "@/content/copy";
import { NAV, isCurrent } from "@/lib/nav";
import { DownloadIcon, Monogram } from "./icons";
import styles from "./Header.module.css";

export const CV_HREF = "/cv.pdf";

export function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header} data-testid="topbar" data-chrome="top">
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          <Monogram size={28} />
          Lorenzo Cavallini
        </Link>
        <nav className={styles.nav} aria-label="Main" data-testid="topnav">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.tools}>
          <a
            className={styles.cv}
            href={CV_HREF}
            download
            aria-label={COPY.ui.cv}
          >
            <span className={styles.cvIcon}>
              <DownloadIcon />
            </span>
            <span className={styles.cvText} aria-hidden="true">
              ↓ {COPY.ui.cv}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
