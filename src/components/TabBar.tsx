"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isCurrent } from "@/lib/nav";
import { TabIcon } from "./icons";
import styles from "./TabBar.module.css";

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      className={styles.tabbar}
      aria-label="Main"
      data-testid="tabbar"
      data-chrome="tabs"
    >
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
        >
          <TabIcon name={item.icon} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
