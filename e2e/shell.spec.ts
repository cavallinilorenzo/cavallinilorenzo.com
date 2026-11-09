import { expect, test } from "@playwright/test";
import { PAGES, type PageKey } from "../src/content/copy";

const ROUTES: [PageKey, string][] = [
  ["home", "/"],
  ["projects", "/projects"],
  ["links", "/links"],
  ["freelance", "/freelance"],
  ["experience", "/experience"],
];

const theme = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.dataset.theme);

test.describe("pages", () => {
  for (const [key, path] of ROUTES) {
    test(`${path} has its title, description and lang`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(PAGES[key].title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        PAGES[key].description,
      );
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("footer")).toContainText(
        "© 2026 Lorenzo Cavallini",
      );
      await expect(page.locator("footer")).toContainText("Mantova, Italy");
    });
  }

  test("the favicon is the monogram", async ({ page, request }) => {
    await page.goto("/");
    const href = await page
      .locator('link[rel="icon"]')
      .first()
      .getAttribute("href");
    expect(href).toBeTruthy();
    const res = await request.get(href!);
    expect(res.headers()["content-type"]).toContain("image/svg+xml");
  });
});

test.describe("desktop top bar", () => {
  test("marks the current page with aria-current", async ({ page }) => {
    for (const [, path] of ROUTES) {
      await page.goto(path);
      const current = page
        .getByTestId("topnav")
        .locator('[aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveAttribute("href", path);
    }
  });

  test("border appears only after scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 500 });
    await page.goto("/");
    const bar = page.getByTestId("topbar");
    await page.addStyleTag({ content: "main{min-height:3000px}" });
    await expect(bar).toHaveCSS("border-bottom-color", "rgba(0, 0, 0, 0)");
    await page.mouse.wheel(0, 400);
    await expect(bar).toHaveCSS("border-bottom-color", "rgb(34, 34, 38)");
  });

  test("tab bar is hidden and nav visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("topnav")).toBeVisible();
    await expect(page.getByTestId("tabbar")).toBeHidden();
  });
});

test.describe("mobile 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("shows the tab bar and hides the top nav", async ({ page }) => {
    await page.goto("/links");
    await expect(page.getByTestId("tabbar")).toBeVisible();
    await expect(page.getByTestId("topnav")).toBeHidden();
    await expect(page.getByTestId("tabbar").locator("a")).toHaveCount(5);
    await expect(
      page.getByTestId("tabbar").locator('[aria-current="page"]'),
    ).toHaveText("Links");
    await expect(page.getByTestId("theme-button")).toBeVisible();
    await expect(page.getByRole("link", { name: "Download CV" })).toBeVisible();
  });
});

test.describe("theme", () => {
  test("first visit is dark even when the OS prefers light", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    expect(await theme(page)).toBe("dark");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(10, 10, 11)",
    );
    await context.close();
  });

  test("switches to light and the choice persists", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/");
    await page.getByTestId("theme-button").click();
    await expect.poll(() => theme(page)).toBe("light");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(250, 250, 250)",
    );

    await page.reload();
    expect(await theme(page)).toBe("light");

    const second = await context.newPage();
    await second.goto("/projects");
    expect(await theme(second)).toBe("light");

    await second.getByTestId("theme-button").click();
    await expect.poll(() => theme(second)).toBe("dark");
    await context.close();
  });

  test("the theme is set before first paint", async ({ browser }) => {
    const context = await browser.newContext();
    await context.addInitScript(() => localStorage.setItem("theme", "light"));
    const page = await context.newPage();
    // Block scripts after the head one: if theme is still right, it was set inline.
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.goto("/");
    expect(await theme(page)).toBe("light");
    await context.close();
  });

  for (const reduce of [false, true]) {
    test(`the switch is a 350 ms cross-fade (reduced motion: ${reduce})`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        reducedMotion: reduce ? "reduce" : "no-preference",
      });
      const page = await context.newPage();
      await page.goto("/");
      const durations = await page.evaluate(async () => {
        document
          .querySelector<HTMLButtonElement>('[data-testid="theme-button"]')!
          .click();
        // The transition's pseudo-elements appear a frame later.
        await new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        );
        return document
          .getAnimations()
          .filter((a) =>
            (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith(
              "::view-transition",
            ),
          )
          .map((a) => a.effect!.getTiming().duration);
      });
      expect(durations.length).toBeGreaterThan(0);
      for (const d of durations) expect(d).toBe(350);
      await context.close();
    });
  }
});

test.describe("CV", () => {
  for (const [, path] of ROUTES) {
    test(`Download CV on ${path} serves a PDF`, async ({ page }) => {
      await page.goto(path);
      const link = page.getByRole("link", { name: "Download CV" }).first();
      const href = await link.getAttribute("href");
      expect(href).toBe("/cv.pdf");
      expect(await link.getAttribute("download")).not.toBeNull();
      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("application/pdf");
      expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
    });
  }
});
