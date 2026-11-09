import type { Page } from "@playwright/test";

/** Waits until every finite entrance / reveal animation has finished, so
 *  bounding boxes are measured at rest (the motion uses transform/translate
 *  only, but a box read mid-animation is shifted). */
export async function settled(page: Page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (a) =>
          a.effect?.getTiming().iterations === Infinity ||
          a.playState !== "running",
      ),
  );
}
