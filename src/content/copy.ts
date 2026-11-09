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
    copyEmail: "Copy email",
    copied: "Email copied",
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
    items: [
      {
        id: "github",
        name: "GitHub",
        desc: "Where the code lives. Hackathon repos included.",
        url: "github.com/cavallinilorenzo",
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        desc: "Where I write about what I build, failures included.",
        url: "linkedin.com/in/cavallini-lorenzo",
      },
      {
        id: "x",
        name: "X",
        desc: "Short posts while I build.",
        url: "x.com/ItsCava05",
      },
      {
        id: "mail",
        name: "Email",
        desc: "The fastest way to reach me. Click to copy.",
      },
    ],
  },
  freelance: {
    title: "Freelance",
    intro:
      "Since February 2026 I've built software for two clients. The goal is always the same: less work done by hand.",
    stats: [
      ["11", "projects delivered"],
      ["2", "clients"],
      ["Feb 2026", "freelancing since"],
    ],
    what: "What I do",
    whatSub: "Three kinds of work, often mixed in the same project.",
    services: [
      {
        id: "auto",
        title: "Automations",
        desc: "If you copy the same data between Gmail, Notion and a spreadsheet every week, I make it copy itself.",
      },
      {
        id: "desk",
        title: "Desktop tools",
        desc: "One app instead of 300 documents a year filled in by hand.",
      },
      {
        id: "ai",
        title: "Scrapers and AI pipelines",
        desc: "Scheduled jobs that read the web or a mailbox, let an LLM structure the data and leave drafts where you work.",
      },
    ],
    clients: [
      {
        id: "strong",
        name: "Strongvilla",
        kind: "Cultural association · client since Feb 2026",
        summary:
          "Music productions, events, a magazine and Mantova Soon, an events guide for the city. Each area ran on its own spreadsheets. I moved the work into one system and automated the daily chores around it.",
        items: [
          [
            "Sales and projects back office",
            "Notion and Make: quotes in the invoicing tool, files in Dropbox, email drafts in Gmail, a budget and a folder for every project.",
          ],
          [
            "Mantova Soon event bot",
            "Every morning it reads yesterday's Instagram posts, Gemini picks out the events (posters included) and drafts land in the CMS.",
          ],
          [
            "Paperwork app",
            "Contracts, receipts and reimbursements for occasional workers: about 300 documents a year, filled in, filed and ready to send.",
          ],
        ],
        stack: ["Notion", "Make", "Python", "Gemini"],
      },
      {
        id: "agent",
        name: "A loan broker",
        kind: "Financial agent · name withheld",
        summary:
          "One person, a lot of loan paperwork. Now the forms fill themselves and the documents file themselves, on the broker's own Mac.",
        items: [
          [
            "Self-filling loan forms",
            "A macOS app fills each file's PDF forms from the client record in Notion.",
          ],
          [
            "Clients from the inbox",
            "New clients land in Notion straight from incoming Gmail messages.",
          ],
          [
            "Local document filing",
            "A background service renames, classifies and files documents with an on-device AI model.",
          ],
        ],
        stack: ["Rust", "Tauri", "Notion", "Make"],
      },
    ],
    clientsTitle: "Clients",
    clientsSub: "What I built, client by client.",
    anon: "Only Strongvilla is named. The other client stays anonymous: no logos, no figures.",
    endQ: "Still copying the same data by hand every week?",
    endAvail: "Taking on new projects",
    write: "Write to me",
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
