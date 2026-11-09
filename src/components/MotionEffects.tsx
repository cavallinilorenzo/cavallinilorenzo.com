"use client";

import { useEffect } from "react";
import { staggerDelays } from "@/lib/reveal";

const BLOCKS = "[data-reveal]:not([data-in])";

/**
 * Mounted once in the layout. Two small effects, no library:
 * - fade-up reveals: every `[data-reveal]` block gets `data-in` the first
 *   time it enters the viewport (CSS animates it), then is never watched
 *   again, so scrolling back up does not replay it. A MutationObserver picks
 *   up the blocks of pages that arrive by client-side navigation.
 * - card glow: the pointer position over a `[data-glow]` card is written to
 *   `--mx` / `--my` for the CSS radial gradient.
 * It renders nothing; without JavaScript the CSS never hides any content.
 */
export function MotionEffects() {
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          );
        const delays = staggerDelays(
          shown.map((e) => (e.target as HTMLElement).dataset.reveal === "card"),
        );
        shown.forEach((e, i) => {
          const el = e.target as HTMLElement;
          el.style.setProperty("--d", `${delays[i]}ms`);
          el.dataset.in = "";
          io.unobserve(el);
        });
        // Blocks scrolled past before they were ever seen (reload mid-page)
        // just appear: there is nothing left to animate.
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.bottom <= 0) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    const scan = () => {
      for (const el of main.querySelectorAll(BLOCKS)) {
        if (seen.has(el)) continue;
        seen.add(el);
        io.observe(el);
      }
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(main, { childList: true, subtree: true });

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-glow]",
      );
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
