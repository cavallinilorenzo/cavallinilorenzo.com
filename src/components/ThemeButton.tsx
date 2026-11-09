"use client";

import { COPY } from "@/content/copy";
import { THEME_KEY, nextTheme, parseTheme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";
import styles from "./Header.module.css";

function applyTheme() {
  const root = document.documentElement;
  const next = nextTheme(parseTheme(root.dataset.theme ?? null));
  root.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Storage unavailable: the choice just won't persist.
  }
}

export function ThemeButton() {
  function onClick() {
    // Whole-page cross-fade through the View Transitions API. Under
    // prefers-reduced-motion it is still a plain cross-fade, which is
    // all this transition ever is. Without the API the swap is instant.
    if (document.startViewTransition) {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  }

  return (
    <button
      type="button"
      className={styles.iconbtn}
      onClick={onClick}
      aria-label={COPY.ui.theme}
      title={COPY.ui.theme}
      data-testid="theme-button"
    >
      {/* Both icons are rendered; CSS shows the right one, so no hydration mismatch. */}
      <span className={styles.iconDark}>
        <SunIcon />
      </span>
      <span className={styles.iconLight}>
        <MoonIcon />
      </span>
    </button>
  );
}
