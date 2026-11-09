import { describe, expect, it } from "vitest";
import { findViolations } from "./check-static.mjs";

const ok = {
  appPaths: {
    "/page": "app/page.js",
    "/links/page": "app/links/page.js",
    "/icon.svg/route": "app/icon.svg/route.js",
  },
  prerendered: ["/", "/links", "/icon.svg"],
  dynamicRoutes: [],
  middleware: {},
  functions: {},
  serverActions: { node: {}, edge: {} },
  sourceFiles: ["src/app/page.tsx", "src/app/links/page.tsx"],
};

const text = (input) => findViolations(input).join("\n");

describe("findViolations", () => {
  it("accepts a fully static build", () => {
    expect(findViolations(ok)).toEqual([]);
  });

  it("flags a page that is not prerendered", () => {
    const appPaths = { ...ok.appPaths, "/blog/page": "x" };
    expect(text({ ...ok, appPaths })).toContain("/blog");
  });

  it("flags dynamic routes", () => {
    expect(text({ ...ok, dynamicRoutes: ["/blog/[slug]"] })).toContain(
      "dynamic",
    );
  });

  it("flags middleware / proxy output", () => {
    expect(text({ ...ok, middleware: { "/": {} } })).toContain("proxy");
    expect(text({ ...ok, functions: { "/": {} } })).toContain("proxy");
  });

  it("flags server actions", () => {
    const serverActions = { node: { abc: {} }, edge: {} };
    expect(text({ ...ok, serverActions })).toContain("server action");
  });

  it("flags route handler and proxy source files", () => {
    expect(text({ ...ok, sourceFiles: ["src/app/api/x/route.ts"] })).toContain(
      "route handler",
    );
    expect(text({ ...ok, sourceFiles: ["src/proxy.ts"] })).toContain("proxy");
    expect(text({ ...ok, sourceFiles: ["src/middleware.ts"] })).toContain(
      "proxy",
    );
  });
});
