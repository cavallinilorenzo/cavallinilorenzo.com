import { expect, test } from "@playwright/test";
import { PAGES, type PageKey } from "../src/content/copy";

const ROUTES: [PageKey, string][] = [
  ["home", "/"],
  ["projects", "/projects"],
  ["links", "/links"],
  ["freelance", "/freelance"],
  ["experience", "/experience"],
];

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
    await expect(page.getByRole("link", { name: "Download CV" })).toBeVisible();
  });
});

test.describe("palette", () => {
  test("the page is white squared paper with navy text", async ({ page }) => {
    await page.goto("/");
    const body = page.locator("body");
    await expect(body).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(body).toHaveCSS("color", "rgb(11, 31, 63)");
    await expect(body).toHaveCSS("background-size", "20px 20px, 20px 20px");
  });

  test("there is no dark theme left", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await context.close();
  });
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
