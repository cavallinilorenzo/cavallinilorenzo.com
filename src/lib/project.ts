// Project registry schema: types, build-time validation and destination rules.
// No dependency on purpose; the registry is validated when it is imported,
// so an invalid entry fails `next build`.

export const PROJECT_STATUSES = [
  "Pre-release",
  "On the App Store",
  "Live",
  "Closed",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const SCREENSHOT_FRAMES = ["iphone"] as const;
export type ScreenshotFrame = (typeof SCREENSHOT_FRAMES)[number];

export type Screenshot = { src: string; frame: ScreenshotFrame };

export type LandingDestination = { kind: "landing"; url: string };
export type PageDestination = {
  kind: "page";
  path: string;
  tagline: string;
  cta: { label: string; url: string };
  price: string;
  screenshots: [Screenshot, Screenshot, Screenshot];
};

export type Project = {
  id: string;
  name: string;
  icon: { src: string; padded?: boolean };
  status: ProjectStatus;
  short: string;
  platform: string;
  stack: string;
  year: string;
  destination: LandingDestination | PageDestination;
};

export const SITE_HOST = "cavallinilorenzo.com";

class RegistryError extends Error {}

function fail(where: string, what: string): never {
  throw new RegistryError(`Project registry: ${where}: ${what}`);
}

function obj(v: unknown, where: string): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v))
    fail(where, "expected an object");
  return v as Record<string, unknown>;
}

function str(o: Record<string, unknown>, key: string, where: string): string {
  const v = o[key];
  if (typeof v !== "string" || v.trim() === "")
    fail(`${where}.${key}`, "expected a non-empty string");
  return v;
}

function httpsUrl(
  o: Record<string, unknown>,
  key: string,
  where: string,
): string {
  const v = str(o, key, where);
  if (!/^https:\/\/[^\s/]+/.test(v))
    fail(`${where}.${key}`, "expected an https URL");
  return v;
}

function parseScreenshot(v: unknown, where: string): Screenshot {
  const o = obj(v, where);
  const frame = o.frame;
  if (!SCREENSHOT_FRAMES.includes(frame as ScreenshotFrame))
    fail(`${where}.frame`, `expected one of ${SCREENSHOT_FRAMES.join(", ")}`);
  return { src: str(o, "src", where), frame: frame as ScreenshotFrame };
}

function parseDestination(
  v: unknown,
  where: string,
): LandingDestination | PageDestination {
  const o = obj(v, where);
  if (o.kind === "landing") {
    return { kind: "landing", url: httpsUrl(o, "url", where) };
  }
  if (o.kind === "page") {
    const path = str(o, "path", where);
    if (!path.startsWith("/")) fail(`${where}.path`, "expected a path");
    const cta = obj(o.cta, `${where}.cta`);
    const shots = o.screenshots;
    if (!Array.isArray(shots) || shots.length !== 3)
      fail(`${where}.screenshots`, "a project page needs exactly 3");
    return {
      kind: "page",
      path,
      tagline: str(o, "tagline", where),
      cta: {
        label: str(cta, "label", `${where}.cta`),
        url: httpsUrl(cta, "url", `${where}.cta`),
      },
      price: str(o, "price", where),
      screenshots: shots.map((s, i) =>
        parseScreenshot(s, `${where}.screenshots[${i}]`),
      ) as PageDestination["screenshots"],
    };
  }
  return fail(`${where}.kind`, 'expected "landing" or "page"');
}

export function parseProject(input: unknown): Project {
  const o = obj(input, "project");
  const id = str(o, "id", "project");
  const where = `project "${id}"`;
  const icon = obj(o.icon, `${where}.icon`);
  if (icon.padded !== undefined && typeof icon.padded !== "boolean")
    fail(`${where}.icon.padded`, "expected a boolean");
  if (!PROJECT_STATUSES.includes(o.status as ProjectStatus))
    fail(`${where}.status`, `expected one of ${PROJECT_STATUSES.join(", ")}`);
  return {
    id,
    name: str(o, "name", where),
    icon: {
      src: str(icon, "src", `${where}.icon`),
      ...(icon.padded ? { padded: true } : {}),
    },
    status: o.status as ProjectStatus,
    short: str(o, "short", where),
    platform: str(o, "platform", where),
    stack: str(o, "stack", where),
    year: str(o, "year", where),
    destination: parseDestination(o.destination, `${where}.destination`),
  };
}

export function parseRegistry(input: readonly unknown[]): Project[] {
  const projects = input.map(parseProject);
  const seen = new Set<string>();
  for (const p of projects) {
    if (seen.has(p.id)) fail(`project "${p.id}"`, "duplicate id");
    seen.add(p.id);
  }
  return projects;
}

/** Arrow on the card: ↗ leaves the site, → stays inside it. */
export function arrowFor(p: Project): "↗" | "→" {
  return p.destination.kind === "page" ? "→" : "↗";
}

export function hrefFor(p: Project): string {
  return p.destination.kind === "page" ? p.destination.path : p.destination.url;
}

/** The destination as shown in the card footer: no scheme. */
export function displayUrl(p: Project): string {
  return p.destination.kind === "page"
    ? SITE_HOST + p.destination.path
    : p.destination.url.replace(/^https:\/\//, "");
}
