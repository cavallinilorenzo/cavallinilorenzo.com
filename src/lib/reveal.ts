/** How long the page waits for MotionEffects before showing everything. */
export const FAILSAFE_MS = 2500;

/**
 * Inline script run in <head>: flags that JavaScript is on, which is the only
 * thing that lets the CSS hide not-yet-revealed blocks. Without JavaScript
 * (or if this never runs) every block simply stays visible. Failsafe: if the
 * bundle never loads, MotionEffects never sets `window.__rv`, so after
 * FAILSAFE_MS the flag is removed and every hidden block shows.
 */
export const JS_FLAG_SCRIPT = `document.documentElement.dataset.js="";setTimeout(function(){if(!window.__rv)delete document.documentElement.dataset.js},${FAILSAFE_MS})`;

/** Gap between two cards that reveal in the same batch. */
export const STAGGER_MS = 70;
/** A batch never waits longer than this many steps. */
export const MAX_STEPS = 5;

/**
 * Delay (ms) for each block of a batch that becomes visible together, in
 * document order. Only cards (`true`) are staggered, by their rank among the
 * cards; other blocks appear at once.
 */
export function staggerDelays(isCard: readonly boolean[]): number[] {
  let rank = 0;
  return isCard.map((card) =>
    card ? Math.min(rank++, MAX_STEPS) * STAGGER_MS : 0,
  );
}
