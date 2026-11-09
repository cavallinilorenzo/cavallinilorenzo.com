export type NavItem = { label: string; href: string; icon: NavIcon };
export type NavIcon =
  "home" | "projects" | "links" | "freelance" | "experience";

export const NAV: readonly NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Projects", href: "/projects", icon: "projects" },
  { label: "Links", href: "/links", icon: "links" },
  { label: "Freelance", href: "/freelance", icon: "freelance" },
  { label: "Experience", href: "/experience", icon: "experience" },
];

function trim(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/** True when `pathname` is the nav item's page or inside it. */
export function isCurrent(pathname: string, href: string): boolean {
  const p = trim(pathname);
  const h = trim(href);
  if (h === "/") return p === "/";
  return p === h || p.startsWith(h + "/");
}
