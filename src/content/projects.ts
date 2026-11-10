// The single source of truth for every Project: Home, the Projects page and
// (later) the Overload Project page read from here. Short descriptions are
// voice M (voice B) from the copy prototype. Validated at import time, so an
// invalid entry fails the build.
import { parseRegistry } from "../lib/project";

// The optimised Overload screenshots live at these paths in `public/`.
const placeholderShot = (n: number) => ({
  src: `/projects/overload/screenshot-${n}.png`,
  frame: "iphone",
});

export const PROJECTS = parseRegistry([
  {
    id: "oxide",
    name: "Oxide",
    icon: { src: "/projects/oxide.png" },
    status: "Pre-release",
    short:
      "Coding agents write the code. Oxide is where you read it, fix it and merge it. Open source, built with Matteo Benassi.",
    platform: "macOS",
    stack: "Rust",
    year: "2026",
    destination: { kind: "landing", url: "https://oxide.cavallinilorenzo.com" },
  },
  {
    id: "overload",
    name: "Overload",
    icon: { src: "/projects/overload.png" },
    status: "On the App Store",
    short:
      "I wanted a gym log without the clutter and without a subscription. So I built one. It's free on the App Store.",
    platform: "iOS",
    stack: "Swift · Supabase",
    year: "2026",
    destination: {
      kind: "page",
      path: "/projects/overload",
      tagline: "Log the set. Beat it next time.",
      cta: {
        label: "View on the App Store",
        url: "https://apps.apple.com/app/id6786719670",
      },
      price: "Free",
      screenshots: [1, 2, 3].map(placeholderShot),
    },
  },
  {
    id: "clicky",
    name: "Clicky.rs",
    icon: { src: "/projects/clicky.png", padded: true },
    status: "Live",
    short:
      "Mechanical keyboard sounds on my MacBook, without installing something shaped like a keylogger. 21 sound packs, never online.",
    platform: "macOS",
    stack: "Rust",
    year: "2026",
    destination: {
      kind: "landing",
      url: "https://clicky.cavallinilorenzo.com",
    },
  },
  {
    id: "gnam",
    name: "GNAM!",
    icon: { src: "/projects/gnam.png" },
    status: "Closed",
    short:
      "My first startup. From idea to the App Store in 3 months, closed soon after. I learned more from it than from anything that worked.",
    platform: "iOS",
    stack: "Flutter",
    year: "2026",
    destination: { kind: "landing", url: "https://gnam.cavallinilorenzo.com" },
  },
]);
