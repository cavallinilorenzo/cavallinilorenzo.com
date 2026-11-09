import { describe, expect, it } from "vitest";
import { THEME_INIT_SCRIPT, THEME_KEY, nextTheme, parseTheme } from "./theme";

describe("parseTheme", () => {
  it("defaults to dark on a first visit", () => {
    expect(parseTheme(null)).toBe("dark");
  });
  it("accepts a stored light or dark choice", () => {
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("dark")).toBe("dark");
  });
  it("falls back to dark on garbage", () => {
    expect(parseTheme("blue")).toBe("dark");
    expect(parseTheme("")).toBe("dark");
  });
});

describe("nextTheme", () => {
  it("toggles", () => {
    expect(nextTheme("dark")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
  });
});

describe("THEME_INIT_SCRIPT", () => {
  function run(storage: { getItem(k: string): string | null }) {
    const root = { dataset: {} as Record<string, string> };
    new Function("document", "localStorage", THEME_INIT_SCRIPT)(
      { documentElement: root },
      storage,
    );
    return root.dataset.theme;
  }

  it("sets dark when nothing is stored, ignoring the OS", () => {
    expect(run({ getItem: () => null })).toBe("dark");
  });
  it("applies the stored light theme", () => {
    expect(run({ getItem: (k) => (k === THEME_KEY ? "light" : null) })).toBe(
      "light",
    );
  });
  it("still sets dark when storage throws", () => {
    expect(
      run({
        getItem: () => {
          throw new Error("denied");
        },
      }),
    ).toBe("dark");
  });
});
