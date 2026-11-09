"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { COPY } from "@/content/copy";
import { NAV, isCurrent } from "@/lib/nav";
import { DownloadIcon, Monogram } from "./icons";
import { ThemeButton } from "./ThemeButton";
import styles from "./Header.module.css";

export const CV_HREF = "/cv.pdf";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled}
      data-testid="topbar"
    >
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
          <ThemeButton />
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
