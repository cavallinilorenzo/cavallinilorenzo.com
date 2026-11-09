import { settled } from "./settled";
import { expect, test } from "@playwright/test";

const TITLES = [
  "Freelance software developer",
  "BSc Computer Engineering",
  "Oxide",
  "ACQUAM 2026 · Hack4Water",
  "Overload on the App Store",
  "GNAM!, my first startup",
  "ItaliansCodeItBetter",
  "SCIoTeM 2026",
  "SCIoTeM 2025",
  "Diploma in Computer Science",
  "IT intern",
];

test.describe("Experience", () => {
  test("lists the eleven entries, Ongoing first then newest first", async ({
    page,
  }) => {
    await page.goto("/experience");
    await expect(page.locator("h1")).toHaveText("Experience");
    await expect(page.getByTestId("entry").locator("h3")).toHaveText(
      TITLES.map(
        (t) => new RegExp(`^${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
      ),
    );
  });

  test("links Oxide to its repository and Freelance to its page", async ({
    page,
  }) => {
    await page.goto("/experience");
    const repo = page.locator("a", { hasText: "Repository ↗" });
    await expect(repo).toHaveAttribute("target", "_blank");
    await expect(repo).toHaveAttribute("href", /^https:\/\/github\.com\//);
    const free = page.locator("a", { hasText: "Freelance →" });
    await expect(free).toHaveAttribute("href", "/freelance");
  });

  test("shows ranges, lengths and badges", async ({ page }) => {
    await page.goto("/experience");
    const first = page.getByTestId("entry").first();
    await expect(first.getByTestId("range")).toContainText("2026 — Present");
    await expect(first.getByTestId("range")).toContainText("so far");
    await expect(page.getByText("2019 — 2024")).toContainText("5 yrs");
    await expect(page.getByText("🏆 1st place")).toHaveCount(2);
    await expect(page.getByText("🏆 2nd place")).toHaveCount(2);
  });

  test("uses the accent only for Ongoing entries", async ({ page }) => {
    await page.goto("/experience");
    const ongoing = await page
      .locator('[data-testid="entry"][data-ongoing]')
      .count();
    expect(ongoing).toBe(2);
    const borders = await page.getByTestId("entry").evaluateAll((els) =>
      els.map((el) => {
        const tile = el.children[1] as HTMLElement;
        return getComputedStyle(tile).borderTopColor;
      }),
    );
    expect(borders[0]).not.toBe(borders[2]);
    expect(borders[1]).not.toBe(borders[2]);
    expect(new Set(borders.slice(2)).size).toBe(1);
  });

  test("at 390px each range sits above its title", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/experience");
    const entry = page.getByTestId("entry").nth(2);
    await entry.scrollIntoViewIfNeeded();
    await settled(page);
    // Read both boxes in one synchronous pass: a reveal translating the
    // entry shifts range and title together, so their relative position is
    // stable, whereas two awaited reads can straddle an animation frame.
    const { rangeBottom, titleTop } = await entry.evaluate((el) => ({
      rangeBottom: el
        .querySelector('[data-testid="range"]')!
        .getBoundingClientRect().bottom,
      titleTop: el.querySelector("h3")!.getBoundingClientRect().top,
    }));
    expect(rangeBottom).toBeLessThanOrEqual(titleTop);
  });
});
