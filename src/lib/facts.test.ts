import { describe, expect, it } from "vitest";
import { findPageProject, factsFor } from "./facts";
import { parseRegistry } from "./project";

const shot = { src: "/s.png", frame: "iphone" };
const raw = (status: string) => ({
  id: "demo",
  name: "Demo",
  icon: { src: "/i.png" },
  status,
  short: "x",
  platform: "iOS",
  stack: "Swift",
  year: "2026",
  destination: {
    kind: "page",
    path: "/projects/demo",
    tagline: "t",
    cta: { label: "Get", url: "https://apps.apple.com/app/id1" },
    price: "Free",
    screenshots: [shot, shot, shot],
  },
});
const landing = {
  ...raw("Live"),
  id: "site",
  destination: { kind: "landing", url: "https://site.example.com" },
};

describe("factsFor", () => {
  it("lists the six facts in order, read from the registry entry", () => {
    const [p] = parseRegistry([raw("On the App Store")]);
    expect(factsFor(p)).toEqual([
      ["Platform", "iOS"],
      ["Stack", "Swift"],
      ["Status", "On the App Store"],
      ["Year", "2026"],
      ["Price", "Free"],
      ["URL", "cavallinilorenzo.com/projects/demo"],
    ]);
  });

  it("follows a status change", () => {
    const [p] = parseRegistry([raw("Closed")]);
    expect(factsFor(p)[2]).toEqual(["Status", "Closed"]);
  });

  it("refuses a project without a Project page", () => {
    const [p] = parseRegistry([landing]);
    expect(() => factsFor(p)).toThrow();
  });
});

describe("findPageProject", () => {
  it("finds a project with a page by id", () => {
    const reg = parseRegistry([landing, raw("Live")]);
    expect(findPageProject(reg, "demo").name).toBe("Demo");
  });
  it("throws for a landing or unknown id", () => {
    const reg = parseRegistry([landing]);
    expect(() => findPageProject(reg, "site")).toThrow();
    expect(() => findPageProject(reg, "nope")).toThrow();
  });
});
