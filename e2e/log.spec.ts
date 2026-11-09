import { expect, test, type Page } from "@playwright/test";

const rows = (page: Page) => page.getByTestId("log-row");
const compact = (page: Page) =>
  page.locator('[data-testid="log-row"][data-compact]');
const height = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollHeight);
const filter = (page: Page, name: string) =>
  page
    .getByRole("group", { name: "Filter the log" })
    .getByRole("button", { name, exact: true });

test.describe("Home log", () => {
  test("draws a graph on every entry and the four projects", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(rows(page)).toHaveCount(12);
    await expect(page.getByTestId("graph")).toHaveCount(12);
    await expect(compact(page)).toHaveCount(0);
    await expect(filter(page, "All")).toHaveAttribute("aria-pressed", "true");
  });

  for (const [name, hidden] of [
    ["Education", 10],
    ["Work", 10],
    ["Hackathon", 8],
    ["Project", 8],
  ] as const) {
    test(`${name} collapses the other rows and shortens the page`, async ({
      page,
    }) => {
      await page.goto("/");
      const all = await height(page);
      await filter(page, name).click();
      await expect(compact(page)).toHaveCount(hidden);
      await expect(filter(page, name)).toHaveAttribute("aria-pressed", "true");
      await expect.poll(() => height(page)).toBeLessThan(all * 0.65);
      for (const box of await compact(page).all()) {
        expect((await box.boundingBox())!.height).toBeLessThanOrEqual(35);
      }
    });
  }

  test("All brings every row back", async ({ page }) => {
    await page.goto("/");
    const all = await height(page);
    await filter(page, "Project").click();
    await expect(compact(page)).toHaveCount(8);
    await filter(page, "All").click();
    await expect(compact(page)).toHaveCount(0);
    await expect.poll(() => height(page)).toBe(all);
  });

  test("filtering from deep in the page returns to the list start", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.evaluate(() =>
      window.scrollTo({ top: 3400, behavior: "instant" }),
    );
    await filter(page, "Education").click();
    await expect(compact(page)).toHaveCount(10);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(800);
  });

  test("still filters without View Transitions", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(document, "startViewTransition", {
        value: undefined,
      });
    });
    await page.goto("/");
    await filter(page, "Work").click();
    await expect(compact(page)).toHaveCount(10);
  });

  test.describe("390px", () => {
    test.use({ viewport: { width: 390, height: 844 } });
    test("does not scroll sideways", async ({ page }) => {
      await page.goto("/");
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(390);
    });
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });
    test("shows the whole log and no dead filter", async ({ page }) => {
      await page.goto("/");
      await expect(rows(page)).toHaveCount(12);
      await expect(
        page.getByRole("group", { name: "Filter the log" }),
      ).toBeHidden();
    });
  });
});
