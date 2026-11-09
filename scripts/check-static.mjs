// Static-only guard (ADR-0001). Runs after `next build` and fails if the site
// stops being fully prerendered or gains server-side code.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_EXT = /\.(?:[cm]?[jt]sx?)$/;

/**
 * Pure check over build manifests and the list of source files.
 * Returns a list of human-readable violations (empty when the site is static).
 */
export function findViolations({
  appPaths,
  prerendered,
  dynamicRoutes,
  middleware,
  functions,
  serverActions,
  sourceFiles,
}) {
  const violations = [];
  const prerenderedSet = new Set(prerendered);

  for (const key of Object.keys(appPaths)) {
    const route = key.replace(/\/(?:page|route)$/, "") || "/";
    if (!prerenderedSet.has(route)) {
      violations.push(`route ${route} is not prerendered as static`);
    }
  }
  for (const route of dynamicRoutes) {
    violations.push(`dynamic route ${route} is not allowed`);
  }
  if (Object.keys(middleware).length > 0 || Object.keys(functions).length > 0) {
    violations.push("proxy/middleware output found in the build");
  }
  const actions = Object.keys(serverActions.node).length;
  const edgeActions = Object.keys(serverActions.edge).length;
  if (actions + edgeActions > 0) {
    violations.push("server action found in the build");
  }
  for (const file of sourceFiles) {
    const name = file.split("/").pop() ?? "";
    if (/^route\.[cm]?[jt]sx?$/.test(name)) {
      violations.push(`route handler ${file} is not allowed`);
    }
    if (/^(?:proxy|middleware)\.[cm]?[jt]sx?$/.test(name)) {
      violations.push(`proxy/middleware ${file} is not allowed`);
    }
  }
  return violations;
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function main() {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const next = join(root, ".next");
  const routes = readJson(join(next, "routes-manifest.json"));
  const sourceFiles = walk(join(root, "src")).map((f) => relative(root, f));
  const violations = findViolations({
    appPaths: readJson(join(next, "server/app-paths-manifest.json")),
    prerendered: Object.keys(
      readJson(join(next, "prerender-manifest.json")).routes,
    ),
    dynamicRoutes: routes.dynamicRoutes.map((r) => r.page ?? String(r)),
    middleware: readJson(join(next, "server/middleware-manifest.json"))
      .middleware,
    functions: readJson(join(next, "server/functions-config-manifest.json"))
      .functions,
    serverActions: readJson(
      join(next, "server/server-reference-manifest.json"),
    ),
    sourceFiles,
  });

  for (const file of sourceFiles.filter((f) => SOURCE_EXT.test(f))) {
    const head = readFileSync(join(root, file), "utf8").slice(0, 400);
    if (/^\s*(?:\/\/.*\n|\/\*[\s\S]*?\*\/\s*)*["']use server["']/.test(head)) {
      violations.push(`server action directive in ${file}`);
    }
  }

  if (violations.length > 0) {
    console.error("Static-only guard failed (ADR-0001):");
    for (const v of violations) console.error(`  - ${v}`);
    process.exit(1);
  }
  console.log("Static-only guard passed: every route is prerendered.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
