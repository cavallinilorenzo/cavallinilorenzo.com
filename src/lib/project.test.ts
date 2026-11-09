import { describe, expect, it } from "vitest";
import {
  PROJECT_STATUSES,
  arrowFor,
  displayUrl,
  hrefFor,
  parseProject,
  parseRegistry,
} from "./project";

const external = {
  id: "oxide",
  name: "Oxide",
  icon: { src: "/projects/oxide.svg" },
  status: "Pre-release",
  short: "A short description.",
  platform: "macOS",
  stack: "Rust",
  year: "2026",
  destination: { kind: "landing", url: "https://oxide.example.com" },
};

const shot = { src: "/s.png", frame: "iphone" };
const page = {
  id: "overload",
  name: "Overload",
  icon: { src: "/projects/overload.png" },
  status: "On the App Store",
  short: "A gym log.",
  platform: "iOS",
  stack: "Swift",
  year: "2026",
  destination: {
    kind: "page",
    path: "/projects/overload",
    tagline: "Log the set.",
    cta: {
      label: "View on the App Store",
      url: "https://apps.apple.com/app/id1",
    },
    price: "Free",
    screenshots: [shot, shot, shot],
  },
};

describe("parseProject", () => {
  it("accepts a landing project", () => {
    expect(parseProject(external).name).toBe("Oxide");
  });
  it("accepts a project page with its page fields", () => {
    expect(parseProject(page).destination.kind).toBe("page");
  });
  it("knows the four statuses", () => {
    expect(PROJECT_STATUSES).toEqual([
      "Pre-release",
      "On the App Store",
      "Live",
      "Closed",
    ]);
  });
  it("rejects an unknown status", () => {
    expect(() => parseProject({ ...external, status: "Beta" })).toThrow(
      /status/,
    );
  });
  it("rejects a project page without screenshots", () => {
    const bad = {
      ...page,
      destination: { ...page.destination, screenshots: [] },
    };
    expect(() => parseProject(bad)).toThrow(/screenshots/);
  });
  it("rejects a project page with two screenshots", () => {
    const bad = {
      ...page,
      destination: { ...page.destination, screenshots: [shot, shot] },
    };
    expect(() => parseProject(bad)).toThrow(/screenshots/);
  });
  it("rejects a project page missing tagline, cta or price", () => {
    for (const key of ["tagline", "cta", "price"]) {
      const rest: Record<string, unknown> = { ...page.destination };
      delete rest[key];
      expect(() => parseProject({ ...page, destination: rest })).toThrow(
        new RegExp(key),
      );
    }
  });
  it("rejects a screenshot without a frame type", () => {
    const bad = {
      ...page,
      destination: {
        ...page.destination,
        screenshots: [shot, shot, { src: "/s.png" }],
      },
    };
    expect(() => parseProject(bad)).toThrow(/frame/);
  });
  it("rejects a missing basic field", () => {
    const rest: Record<string, unknown> = { ...external };
    delete rest.name;
    expect(() => parseProject(rest)).toThrow(/name/);
  });
  it("rejects a landing that is not an https URL", () => {
    expect(() =>
      parseProject({
        ...external,
        destination: { kind: "landing", url: "oxide.example.com" },
      }),
    ).toThrow(/url/);
  });
});

describe("parseRegistry", () => {
  it("rejects duplicate ids", () => {
    expect(() => parseRegistry([external, external])).toThrow(/duplicate/i);
  });
  it("keeps the given order", () => {
    expect(parseRegistry([external, page]).map((p) => p.id)).toEqual([
      "oxide",
      "overload",
    ]);
  });
});

describe("destination rules", () => {
  const landing = parseProject(external);
  const inside = parseProject(page);
  it("uses the arrow ↗ for a landing and → for a project page", () => {
    expect(arrowFor(landing)).toBe("↗");
    expect(arrowFor(inside)).toBe("→");
  });
  it("links to the landing URL or the internal path", () => {
    expect(hrefFor(landing)).toBe("https://oxide.example.com");
    expect(hrefFor(inside)).toBe("/projects/overload");
  });
  it("shows the URL without the scheme", () => {
    expect(displayUrl(landing)).toBe("oxide.example.com");
    expect(displayUrl(inside)).toBe("cavallinilorenzo.com/projects/overload");
  });
});
