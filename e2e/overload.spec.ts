import { expect, test } from "@playwright/test";
import { OVERLOAD_PAGE } from "../src/content/copy";
import { PROJECTS } from "../src/content/projects";

const FACTS = [
  ["Platform", "iOS"],
  ["Stack", "Swift · Supabase"],
  ["Status", "On the App Store"],
  ["Year", "2026"],
  ["Price", "Free"],
  ["URL", "cavallinilorenzo.com/projects/overload"],
];

test.describe("Overload Project page", () => {
  test("has its title and description", async ({ page }) => {
    await page.goto("/projects/overload");
    await expect(page).toHaveTitle("Overload · Lorenzo Cavallini");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      OVERLOAD_PAGE.description,
    );
  });

  test("shows breadcrumb, hero, screenshots, prose and facts", async ({
    page,
  }) => {
    await page.goto("/projects/overload");
    await expect(
      page.getByRole("link", { name: "← Projects" }),
    ).toHaveAttribute("href", "/projects");
    await expect(page.locator("h1")).toHaveText("Overload");
    await expect(
      page.getByText("Log the set. Beat it next time."),
    ).toBeVisible();
    const cta = page.getByRole("link", { name: "View on the App Store ↗" });
    await expect(cta).toHaveAttribute(
      "href",
      "https://apps.apple.com/app/id6786719670",
    );
    await expect(page.getByTestId("screenshots").locator("> *")).toHaveCount(3);
    for (const h of ["What it is", "Why I built it", "Features"])
      await expect(page.getByRole("heading", { name: h })).toBeVisible();
    await expect(page.locator("main li")).toHaveCount(6);
    const facts = page.getByTestId("facts");
    for (const [label, value] of FACTS) {
      const row = facts.locator("div", {
        has: page.getByText(label, { exact: true }),
      });
      await expect(row).toContainText(value);
    }
    await expect(facts.locator("dt")).toHaveCount(6);
  });

  test("keeps the facts box in view while scrolling on desktop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/projects/overload");
    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(page.getByTestId("facts")).toHaveCSS("position", "sticky");
    const box = (await page.getByTestId("facts").boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(720);
  });

  test("stacks the columns at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/projects/overload");
    const prose = (await page
      .getByRole("heading", { name: "What it is" })
      .boundingBox())!;
    const facts = (await page.getByTestId("facts").boundingBox())!;
    expect(facts.y).toBeGreaterThan(prose.y);
    expect(Math.abs(facts.x - prose.x)).toBeLessThan(2);
  });

  test("the Overload card opens the page", async ({ page }) => {
    await page.goto("/projects");
    await page.getByTestId("project-card").nth(1).click();
    await expect(page).toHaveURL(/\/projects\/overload$/);
    await expect(page.locator("h1")).toHaveText("Overload");
  });

  test("status in the registry shows on Home, Projects and the facts box", async ({
    page,
  }) => {
    const status = PROJECTS.find((p) => p.id === "overload")!.status;
    for (const path of ["/", "/projects"]) {
      await page.goto(path);
      await expect(page.getByTestId("project-card").nth(1)).toContainText(
        status,
      );
    }
    await page.goto("/projects/overload");
    await expect(page.getByTestId("facts")).toContainText(status);
  });
});
