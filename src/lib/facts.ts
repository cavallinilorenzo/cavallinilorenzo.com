// Project page logic: which project a page shows and the facts box rows.
// Everything is read from the registry entry, never restated.
import { displayUrl, type Project, type PageDestination } from "./project";

export type PageProject = Project & { destination: PageDestination };

export function findPageProject(
  registry: readonly Project[],
  id: string,
): PageProject {
  const p = registry.find((x) => x.id === id);
  if (!p) throw new Error(`No project "${id}" in the registry`);
  if (p.destination.kind !== "page")
    throw new Error(`Project "${id}" has no Project page`);
  return p as PageProject;
}

/** Rows of the facts box, in display order. */
export function factsFor(p: Project): [label: string, value: string][] {
  if (p.destination.kind !== "page")
    throw new Error(`Project "${p.id}" has no Project page`);
  return [
    ["Platform", p.platform],
    ["Stack", p.stack],
    ["Status", p.status],
    ["Year", p.year],
    ["Price", p.destination.price],
    ["URL", displayUrl(p)],
  ];
}
