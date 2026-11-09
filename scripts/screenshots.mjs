// Screenshots of a page in dark and light, desktop and 390px wide.
// Usage: node scripts/screenshots.mjs [path=/] [outDir=screenshots]
// Needs the production server on :3100 (`pnpm build && pnpm start --port 3100`).
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const path = process.argv[2] ?? "/";
const out = process.argv[3] ?? "screenshots";
const name = path === "/" ? "home" : path.replace(/\//g, "");
const sizes = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
for (const [size, viewport] of Object.entries(sizes)) {
  for (const theme of ["dark", "light"]) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
    });
    await context.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const page = await context.newPage();
    await page.goto(`http://localhost:${process.env.E2E_PORT ?? 3100}${path}`);
    await page.waitForLoadState("load");
    await page.waitForTimeout(800); // prefetches keep the network from idling
    await page.screenshot({ path: `${out}/${name}-${theme}-${size}.png` });
    await context.close();
  }
}
await browser.close();
