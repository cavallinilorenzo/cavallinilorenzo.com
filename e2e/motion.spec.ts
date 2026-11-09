import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";

const PATHS = [
  "/",
  "/projects",
  "/projects/overload",
  "/links",
  "/freelance",
  "/experience",
];

const reveals = (page: Page) => page.locator("[data-reveal]");
const revealed = (page: Page) => page.locator("[data-reveal][data-in]");

async function scrollToBottom(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
}

test.describe("hero entrance", () => {
  test("plays right after load and finishes within ~1.2 s", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      document.addEventListener("DOMContentLoaded", () => {
        const w = window as unknown as { __hero: unknown[] };
        w.__hero = document
          .getAnimations()
          .filter((a) => a.effect?.getTiming().iterations !== Infinity)
          .map((a) => ({
            name: (a as CSSAnimation).animationName,
            end: a.effect?.getComputedTiming().endTime,
          }));
      });
    });
    await page.goto("/");
    const hero = await page.evaluate(
      () =>
        (window as unknown as { __hero: { name: string; end: number }[] })
          .__hero,
    );
    const names = hero.map((h) => h.name).join(" ");
    expect(names).toMatch(/fade-up/);
    expect(names).toMatch(/rise/);
    expect(hero.length).toBeGreaterThanOrEqual(5);
    // every entrance animation (delay included) ends by 1.2 s
    for (const h of hero) expect(h.end).toBeLessThanOrEqual(1200);
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              document
                .getAnimations()
                .filter((a) => a.effect?.getTiming().iterations !== Infinity)
                .filter((a) => a.playState === "running").length,
          ),
        { timeout: 2500 },
      )
      .toBe(0);
  });

  test("uses no spring or bounce easing", async ({ page }) => {
    await page.goto("/");
    const easings = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.effect?.getTiming().easing),
    );
    for (const e of easings) expect(e).not.toMatch(/linear\(|spring/);
  });
});

test.describe("card hover", () => {
  test("lifts 2 px, tints the border and shows the glow", async ({ page }) => {
    await page.goto("/projects");
    const card = page.getByTestId("project-card").first();
    await expect(card).toHaveAttribute("data-in", "");
    const before = await card.evaluate(
      (el) => getComputedStyle(el).borderColor,
    );
    await card.hover();
    await expect
      .poll(() => card.evaluate((el) => getComputedStyle(el).transform))
      .toBe("matrix(1, 0, 0, 1, 0, -2)");
    const after = await card.evaluate((el) => getComputedStyle(el).borderColor);
    expect(after).not.toBe(before);
    await expect
      .poll(() =>
        card.evaluate((el) => getComputedStyle(el, "::before").opacity),
      )
      .toBe("1");
    const mx = await card.evaluate((el) => el.style.getPropertyValue("--mx"));
    expect(mx).toMatch(/px$/);
  });
});

test.describe("scroll reveals", () => {
  test("a below-the-fold card reveals once and never replays", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto("/");
    const last = page.getByTestId("project-card").last();
    await expect(last).not.toHaveAttribute("data-in", "");
    expect(await last.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    await last.scrollIntoViewIfNeeded();
    await expect(last).toHaveAttribute("data-in", "");
    await expect
      .poll(() => last.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");
    // wait for the animation to end, then go away and come back
    await expect
      .poll(() => last.evaluate((el) => el.getAnimations().length))
      .toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    await last.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    expect(await last.evaluate((el) => el.getAnimations().length)).toBe(0);
    await expect(last).toHaveAttribute("data-in", "");
  });

  test("cards entering together are staggered", async ({ page }) => {
    await page.goto("/projects");
    await expect(
      page.locator("[data-testid=project-card][data-in]"),
    ).toHaveCount(4);
    const delays = await page
      .getByTestId("project-card")
      .evaluateAll((els) =>
        els.map((el) => (el as HTMLElement).style.getPropertyValue("--d")),
      );
    expect(delays).toEqual(["0ms", "70ms", "140ms", "210ms"]);
  });

  test("after client-side navigation the new page's blocks reveal", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto("/");
    for (const [name, selector] of [
      ["Freelance", "section[data-reveal]"],
      ["Experience", "[data-testid=entry]"],
    ] as const) {
      await page.getByRole("link", { name, exact: true }).first().click();
      await expect(page.locator("h1")).toHaveText(name);
      const blocks = page.locator(selector);
      await expect(blocks.first()).toHaveAttribute("data-in", "");
      await scrollToBottom(page);
      const n = await blocks.count();
      await expect(page.locator(`${selector}[data-in]`)).toHaveCount(n);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no entrance, no reveal hiding, no lift", async ({ page }) => {
    await page.goto("/");
    const heroAnims = await page.evaluate(
      () =>
        document.querySelector("section")!.getAnimations({ subtree: true })
          .length,
    );
    expect(heroAnims).toBe(0);
    const opacities = await reveals(page).evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).opacity),
    );
    expect(opacities.length).toBeGreaterThan(0);
    expect(new Set(opacities)).toEqual(new Set(["1"]));
    const last = page.getByTestId("project-card").last();
    await last.scrollIntoViewIfNeeded();
    await last.hover();
    await page.waitForTimeout(400);
    expect(await last.evaluate((el) => getComputedStyle(el).transform)).toBe(
      "none",
    );
    expect(
      await last.evaluate((el) => getComputedStyle(el, "::before").opacity),
    ).toBe("0");
    expect(await last.evaluate((el) => el.getAnimations().length)).toBe(0);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const path of PATHS) {
    test(`${path} is fully visible`, async ({ page }) => {
      await page.goto(path);
      const n = await reveals(page).count();
      if (path !== "/links" || n > 0) expect(n).toBeGreaterThan(0);
      const opacities = await reveals(page).evaluateAll((els) =>
        els.map((el) => getComputedStyle(el).opacity),
      );
      expect(new Set(opacities)).toEqual(new Set(["1"]));
      expect(await revealed(page).count()).toBe(0);
    });
  }
});

test.describe("no animation library", () => {
  test("package.json and built client chunks have none", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    for (const lib of ["motion", "framer-motion", "gsap", "lenis", "three"])
      expect(deps).not.toContain(lib);

    const files: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (p.endsWith(".js")) files.push(p);
      }
    };
    walk(".next/static");
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/gsap|lenis|WebGLRenderer|framer-motion/i);
    }
  });
});
