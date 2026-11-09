import { expect, test, type Page } from "@playwright/test";

// Records, for every view transition that starts, which pseudo-elements were
// animating once it was ready. Installed before the page scripts run.
const RECORDER = `
  window.__vt = [];
  const orig = document.startViewTransition?.bind(document);
  if (orig) {
    document.startViewTransition = (...args) => {
      const t = orig(...args);
      t.ready.then(() => {
        window.__vt.push(
          document.getAnimations().map((a) => ({
            pseudo: a.effect?.pseudoElement ?? "",
            name: a.animationName ?? "",
            keys: a.effect?.getKeyframes().map((k) => Object.keys(k)).flat() ?? [],
          })),
        );
      }).catch(() => {});
      return t;
    };
  }
`;

type Anim = { pseudo: string; name: string; keys: string[] };
const recorded = (page: Page) =>
  page.evaluate(() => (window as unknown as { __vt: Anim[][] }).__vt);

const overloadCard = (page: Page) =>
  page.getByTestId("project-card").filter({ hasText: "Overload" });
const isSlide = (a: Anim) => a.name === "page-in" || a.name === "page-out";

test.describe("page transitions", () => {
  test("pages animate, only Overload morphs, the top bar stays still", async ({
    page,
  }) => {
    await page.addInitScript(RECORDER);
    await page.goto("/");
    await page
      .getByRole("link", { name: "Projects", exact: true })
      .first()
      .click();
    await page.waitForURL("**/projects");
    await page.waitForTimeout(900);
    await overloadCard(page).click();
    await page.waitForURL("**/projects/overload");
    await page.waitForTimeout(900);

    const runs = await recorded(page);
    expect(runs.length).toBeGreaterThanOrEqual(2);
    for (const r of runs) expect(r.some(isSlide)).toBe(true);

    const last = runs[runs.length - 1];
    const names = last.map((a) => a.pseudo).join(" ");
    expect(names).toMatch(/overload-icon/);
    expect(names).toMatch(/overload-name/);
    // Only the opened Project morphs: no other card has shared names.
    for (const other of ["oxide", "clicky", "gnam"]) {
      expect(names).not.toContain(`${other}-`);
    }
    // The top bar is its own layer that never slides.
    expect(last.some((a) => a.pseudo.includes("chrome-top"))).toBe(true);
    expect(
      last.filter(isSlide).every((a) => !a.pseudo.includes("chrome")),
    ).toBe(true);

    // Back reverses the morph.
    await page.getByRole("link", { name: "← Projects" }).click();
    await page.waitForURL("**/projects");
    await page.waitForTimeout(900);
    const after = await recorded(page);
    const back = after[after.length - 1].map((a) => a.pseudo).join(" ");
    expect(back).toMatch(/overload-icon/);
  });

  test("mid-transition screenshot shows the slide and morph", async ({
    page,
  }, info) => {
    await page.goto("/projects");
    await page.evaluate(() => {
      const orig = document.startViewTransition.bind(document);
      document.startViewTransition = (...a: Parameters<typeof orig>) => {
        const t = orig(...a);
        void t.ready.then(() =>
          document.getAnimations().forEach((x) => {
            x.pause();
            x.currentTime = 250;
          }),
        );
        return t;
      };
    });
    await overloadCard(page).click();
    await page.waitForURL("**/projects/overload");
    await page.waitForTimeout(300);
    await page.screenshot({ path: info.outputPath("mid-transition.png") });
  });

  test("without View Transitions the navigation still works", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(document, "startViewTransition", {
        value: undefined,
      });
    });
    await page.goto("/");
    await page
      .getByRole("link", { name: "Projects", exact: true })
      .first()
      .click();
    await page.waitForURL("**/projects");
    await overloadCard(page).click();
    await page.waitForURL("**/projects/overload");
    await expect(
      page.getByRole("heading", { level: 1, name: "Overload" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "← Projects" }).click();
    await page.waitForURL("**/projects");
    await expect(page.getByTestId("project-grid")).toBeVisible();
  });

  test("reduced motion: only cross-fades, nothing slides or morphs", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(RECORDER);
    await page.goto("/projects");
    await overloadCard(page).click();
    await page.waitForURL("**/projects/overload");
    await page.waitForTimeout(900);
    const all = (await recorded(page)).flat();
    expect(all.length).toBeGreaterThan(0);
    expect(all.some(isSlide)).toBe(false);
    expect(all.some((a) => a.pseudo.includes("overload-"))).toBe(false);
    // Group animations carry the browser's own transform keyframes; the
    // content layers (old/new) must only fade.
    const layers = all.filter((a) => !a.pseudo.includes("-group("));
    expect(layers.length).toBeGreaterThan(0);
    expect(layers.some((a) => a.keys.includes("transform"))).toBe(false);
  });
});
