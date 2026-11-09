import { describe, expect, it } from "vitest";
import { PROJECTS } from "./projects";
import { arrowFor, hrefFor } from "../lib/project";

describe("the real registry", () => {
  it("holds the four projects in order", () => {
    expect(PROJECTS.map((p) => p.name)).toEqual([
      "Oxide",
      "Overload",
      "Clicky.rs",
      "GNAM!",
    ]);
  });
  it("has the agreed statuses", () => {
    expect(PROJECTS.map((p) => p.status)).toEqual([
      "Pre-release",
      "On the App Store",
      "Live",
      "Closed",
    ]);
  });
  it("points at the agreed destinations", () => {
    expect(PROJECTS.map(hrefFor)).toEqual([
      "https://oxide.cavallinilorenzo.com",
      "/projects/overload",
      "https://clicky.cavallinilorenzo.com",
      "https://gnam.cavallinilorenzo.com",
    ]);
    expect(PROJECTS.map(arrowFor)).toEqual(["↗", "→", "↗", "↗"]);
  });
  it("gives Overload the only project page, with its App Store URL", () => {
    const pages = PROJECTS.filter((p) => p.destination.kind === "page");
    expect(pages.map((p) => p.id)).toEqual(["overload"]);
    const d = pages[0].destination;
    if (d.kind !== "page") throw new Error("unreachable");
    expect(d.cta.url).toBe("https://apps.apple.com/app/id6786719670");
    expect(d.screenshots).toHaveLength(3);
  });
  it("uses no em or en dash in any visible string", () => {
    for (const p of PROJECTS) {
      expect(JSON.stringify(p)).not.toMatch(/[–—]/);
    }
  });
});
