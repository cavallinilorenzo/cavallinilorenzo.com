import { expect, test } from "@playwright/test";

test.describe("reveal failsafe", () => {
  test("content becomes visible when the JS bundle never loads", async ({
    page,
  }) => {
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.goto("/freelance");
    const blocks = page.locator("[data-reveal]");
    expect(await blocks.count()).toBeGreaterThan(0);
    for (const el of await blocks.all()) {
      await expect(el).toHaveCSS("opacity", "1", { timeout: 6000 });
    }
  });
});
