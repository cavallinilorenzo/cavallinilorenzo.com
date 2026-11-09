// Every string here comes from the COPY object of the copy prototype
// (branch prototype/copy), voice M: voice B, except the keys its MIX table
// takes from voice A (links.x, links.mail, fl.svc.ai.d, fl.strong.sum, exp.intro).

export type PageKey =
  "home" | "projects" | "links" | "freelance" | "experience";

export const PAGES: Record<PageKey, { title: string; description: string }> = {
  home: {
    title: "Lorenzo Cavallini",
    description:
      "Computer engineering student in Mantova, Italy. I build native apps, developer tools and automations for small businesses.",
  },
  projects: {
    title: "Projects · Lorenzo Cavallini",
    description:
      "Oxide, Overload, Clicky.rs and GNAM!: the apps and tools I've built and shipped.",
  },
  links: {
    title: "Links · Lorenzo Cavallini",
    description:
      "Lorenzo Cavallini on GitHub, LinkedIn and X, plus the email that reaches him fastest.",
  },
  freelance: {
    title: "Freelance · Lorenzo Cavallini",
    description:
      "Automations, desktop tools and AI pipelines for small businesses. 11 projects delivered for 2 clients since February 2026.",
  },
  experience: {
    title: "Experience · Lorenzo Cavallini",
    description:
      "University, freelance work, hackathons and shipped projects, in one timeline.",
  },
};

export const COPY = {
  ui: {
    cv: "Download CV",
    theme: "Switch theme",
  },
  footer: {
    left: "© 2026 Lorenzo Cavallini",
    right: "Mantova, Italy",
  },
  home: {
    // The third part is shown in the accent colour.
    h1: ["By day I study,", "by night I ", "build", "."] as const,
    avail: "Open to internships and freelance work",
    intro:
      "I'm Lorenzo, 21, in my last year of computer engineering. If I need a tool, I build it. Sometimes other people need it too.",
    ctaProjects: "See projects",
  },
  projects: {
    title: "Projects",
    intro:
      "Four projects. Three are alive, one is closed, and it stays here anyway.",
  },
  links: {
    title: "Links",
    intro: "Where I push code, where I post, and how to reach me.",
  },
  freelance: {
    title: "Freelance",
    intro:
      "Since February 2026 I've built software for two clients. The goal is always the same: less work done by hand.",
  },
  experience: {
    title: "Experience",
    intro:
      "One timeline: university, freelance work, hackathons and the things I've shipped.",
  },
} as const;

/** Every visible string, for content lint tests. */
export function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PAGES);
  walk(COPY);
  return out;
}
