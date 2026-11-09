export type Theme = "dark" | "light";

export const THEME_KEY = "theme";

/** First visit is dark regardless of the OS; only an explicit "light" wins. */
export function parseTheme(raw: string | null): Theme {
  return raw === "light" ? "light" : "dark";
}

export function nextTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

/**
 * Inline script run in <head> before first paint, so the page never flashes
 * the wrong theme. Kept as a plain string: it cannot import anything.
 */
export const THEME_INIT_SCRIPT = `(function(){var t="dark";try{if(localStorage.getItem(${JSON.stringify(THEME_KEY)})==="light")t="light"}catch(e){}document.documentElement.dataset.theme=t})()`;
