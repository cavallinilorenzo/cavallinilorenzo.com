import { expect, test } from "@playwright/test";

const EMAIL = "hello@cavallinilorenzo.com";

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

const clipboard = (page: import("@playwright/test").Page) =>
  page.evaluate(() => navigator.clipboard.readText());

test.describe("Links", () => {
  test("shows four equal tiles with the right hrefs", async ({ page }) => {
    await page.goto("/links");
    await expect(page.locator("h1")).toHaveText("Links");
    const tiles = page.locator("main h3");
    await expect(tiles).toHaveText(["GitHub", "LinkedIn", "X", "Email"]);

    const hrefs: [string, string][] = [
      ["GitHub", "https://github.com/cavallinilorenzo"],
      ["LinkedIn", "https://linkedin.com/in/cavallini-lorenzo"],
      ["X", "https://x.com/ItsCava05"],
    ];
    for (const [name, href] of hrefs) {
      const link = page.locator("main a", {
        has: page.getByRole("heading", { name, exact: true }),
      });
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toContainText("↗");
    }
    await expect(page.locator('main a[href*="apps.apple"]')).toHaveCount(0);

    const boxes = await page
      .locator('main [class*="tile"]')
      .evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return [Math.round(r.width), Math.round(r.height)];
        }),
      );
    expect(boxes).toHaveLength(4);
    for (const b of boxes) expect(b).toEqual(boxes[0]);
  });

  test("the Email tile shows the address and copies it", async ({ page }) => {
    await page.goto("/links");
    const tile = page.getByTestId("email-tile");
    await expect(tile).toContainText(EMAIL);
    await expect(tile).toContainText("⧉");
    await tile.click();
    await expect(page.getByTestId("copy-toast")).toHaveText("Email copied");
    expect(await clipboard(page)).toBe(EMAIL);
  });
});

test.describe("Freelance", () => {
  test("stats, services and clients", async ({ page }) => {
    await page.goto("/freelance");
    const stats = page.getByTestId("stats");
    await expect(stats.locator("b")).toHaveText(["11", "2", "Feb 2026"]);
    await expect(page.getByTestId("services").locator("h3")).toHaveText([
      "Automations",
      "Desktop tools",
      "Scrapers and AI pipelines",
    ]);
    const clients = page.getByTestId("client");
    await expect(clients.locator("h3")).toHaveText([
      "Strongvilla",
      "A loan broker",
    ]);
    await expect(clients.locator("img")).toHaveCount(0);
    await expect(page.getByText(/calendar/i)).toHaveCount(0);
    await expect(
      page.getByText(
        "Only Strongvilla is named. The other client stays anonymous: no logos, no figures.",
      ),
    ).toBeVisible();
  });

  test("closing band writes and copies", async ({ page }) => {
    await page.goto("/freelance");
    await expect(
      page.getByText("Still copying the same data by hand every week?"),
    ).toBeVisible();
    await expect(page.getByText("Taking on new projects")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Write to me →" }),
    ).toHaveAttribute("href", `mailto:${EMAIL}`);
    await page.getByRole("button", { name: "Copy email" }).click();
    await expect(page.getByTestId("copy-toast")).toHaveText("Email copied");
    expect(await clipboard(page)).toBe(EMAIL);
  });

  test("client cards are side by side on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/freelance");
    const [a, b] = await page
      .getByTestId("client")
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
    expect(Math.abs(a.top - b.top)).toBeLessThan(2);
    expect(Math.round(a.width)).toBe(Math.round(b.width));
    expect(b.left).toBeGreaterThan(a.right - 1);
  });

  test.describe("390px", () => {
    test.use({ viewport: { width: 390, height: 844 } });
    test("client cards stack", async ({ page }) => {
      await page.goto("/freelance");
      const [a, b] = await page
        .getByTestId("client")
        .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
      expect(b.top).toBeGreaterThan(a.bottom - 1);
      expect(Math.round(a.left)).toBe(Math.round(b.left));
    });
  });
});
