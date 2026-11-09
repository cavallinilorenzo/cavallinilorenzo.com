import { expect, test } from "@playwright/test";
import { settled } from "./settled";

const CARDS = [
  ["Oxide", "Pre-release", "https://oxide.cavallinilorenzo.com", "↗"],
  ["Overload", "On the App Store", "/projects/overload", "→"],
  ["Clicky.rs", "Live", "https://clicky.cavallinilorenzo.com", "↗"],
  ["GNAM!", "Closed", "https://gnam.cavallinilorenzo.com", "↗"],
] as const;

async function expectCards(page: import("@playwright/test").Page) {
  const cards = page.getByTestId("project-card");
  await expect(cards).toHaveCount(4);
  for (const [i, [name, status, href, arrow]] of CARDS.entries()) {
    const card = cards.nth(i);
    await expect(card.getByRole("heading", { name })).toBeVisible();
    await expect(card).toContainText(status);
    await expect(card).toHaveAttribute("href", href);
    await expect(card.locator("img")).toBeVisible();
    await expect(card).toContainText(
      href.replace(/^https:\/\//, "").replace(/^\//, "cavallinilorenzo.com/"),
    );
    await expect(card).toContainText(arrow);
  }
}

test.describe("Projects page", () => {
  test("shows four cards, in order, and nothing else", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.locator("h1")).toHaveText("Projects");
    await expectCards(page);
    await expect(page.locator("body")).not.toContainText("Pratica");
    await expect(page.locator("body")).not.toContainText("AlwaysClaudeCode");
  });

  test("stacks the projects as full-width bands", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/projects");
    await settled(page);
    const boxes = await page.getByTestId("project-card").evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y) };
      }),
    );
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].y).toBeGreaterThan(boxes[i - 1].y);
      expect(boxes[i].x).toBe(boxes[0].x);
    }
  });
});

test.describe("Home", () => {
  test("shows the hero elements in order", async ({ page }) => {
    await page.goto("/");
    const avail = page.getByText("Open to internships and freelance work");
    const h1 = page.locator("h1");
    const intro = page.getByText("I'm Lorenzo, 21");
    const see = page.getByRole("link", { name: "See projects →" });
    const cv = page.getByRole("link", { name: "↓ Download CV" });
    const copy = page.getByRole("button", { name: "Copy email" });
    await expect(h1).toHaveText(/Study by day,\s*build by night\./);
    await expect(h1.locator("span:has(> svg)")).toHaveText(["Study", "build"]);
    await settled(page);
    const ys = await Promise.all(
      [avail, h1, intro, see].map(async (l) => (await l.boundingBox())!.y),
    );
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    const xs = await Promise.all(
      [see, cv, copy].map(async (l) => (await l.boundingBox())!.x),
    );
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  });

  test("shows the four projects inside the log", async ({ page }) => {
    await page.goto("/");
    await expectCards(page);
  });

  test("See projects opens the Projects page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "See projects →" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.locator("h1")).toHaveText("Projects");
  });

  test("Copy email puts the address on the clipboard and confirms", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: "Copy email" }).click();
    await expect(page.getByTestId("copy-toast")).toHaveText("Email copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "hello@cavallinilorenzo.com",
    );
    await context.close();
  });
});
