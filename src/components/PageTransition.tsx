import { ViewTransition } from "react";

// Wraps a page's content so React runs the page-out / page-in animations
// (styled in globals.css) when a navigation swaps this page for another.
// It belongs in each page.tsx, not the layout: layouts persist, so enter
// and exit would never fire there.
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
