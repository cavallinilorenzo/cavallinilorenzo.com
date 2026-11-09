import { describe, expect, it } from "vitest";
import { NAV, isCurrent } from "./nav";

describe("NAV", () => {
  it("lists the five pages in order", () => {
    expect(NAV.map((n) => n.label)).toEqual([
      "Home",
      "Projects",
      "Links",
      "Freelance",
      "Experience",
    ]);
    expect(NAV.map((n) => n.href)).toEqual([
      "/",
      "/projects",
      "/links",
      "/freelance",
      "/experience",
    ]);
  });
});

describe("isCurrent", () => {
  it("matches Home only on the root", () => {
    expect(isCurrent("/", "/")).toBe(true);
    expect(isCurrent("/projects", "/")).toBe(false);
  });
  it("matches a section and its children", () => {
    expect(isCurrent("/projects", "/projects")).toBe(true);
    expect(isCurrent("/projects/overload", "/projects")).toBe(true);
  });
  it("does not match a sibling with the same prefix", () => {
    expect(isCurrent("/projectsx", "/projects")).toBe(false);
  });
  it("ignores a trailing slash", () => {
    expect(isCurrent("/links/", "/links")).toBe(true);
  });
});
