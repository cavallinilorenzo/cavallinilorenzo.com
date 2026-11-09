// The eleven Timeline entries. Strings are voice M (voice B) from the copy
// prototype, dates/types/awards from its EXP list. No cities.
import type { TimelineEntry } from "../lib/experience";

export type Glyph = "cap" | "trophy" | "bag" | "tool" | "school";

export type ExperienceEntry = TimelineEntry & {
  title: string;
  org: string;
  text: string;
  /** App icon taken from the Project registry. */
  project?: string;
  /** Simple glyph for entries that are not a Project. */
  glyph?: Glyph;
  /** Hackathon place, shown as a neutral badge. */
  place?: 1 | 2;
  link?: { label: string; href: string };
};

export const TYPE_LABEL = {
  edu: "Education",
  work: "Work",
  hack: "Hackathon",
  proj: "Project",
} as const;

export const PLACE_LABEL = { 1: "1st place", 2: "2nd place" } as const;

// UNCONFIRMED: Oxide's start month (Oct 2026) is a guess carried over from the
// prototype. Check it against the `cv` repo before launch (issue #17).
const OXIDE_START = "2026-10";

// UNCONFIRMED: the Oxide repository URL is a guess; fix it when the repo is public.
const OXIDE_REPO = "https://github.com/cavallinilorenzo/oxide";

export const TIMELINE: readonly ExperienceEntry[] = [
  {
    id: "oxide",
    start: OXIDE_START,
    type: "proj",
    project: "oxide",
    title: "Oxide",
    org: "Open source · Rust · with Matteo Benassi",
    text: "An open-source desktop app to review and merge what coding agents write. Claude Code, Codex and Antigravity CLI in one window. Pre-release.",
    link: { label: "Repository", href: OXIDE_REPO },
  },
  {
    id: "acquam",
    start: "2026-09",
    type: "hack",
    place: 1,
    glyph: "trophy",
    title: "ACQUAM 2026 · Hack4Water",
    org: "Team of 3",
    text: "Hack4Water Alert: a web app with no account and no download to report broken pipes and flooded fields, with GPS, photos and voice notes an LLM turns into data. I gave most of the 8-minute pitch.",
  },
  {
    id: "overload",
    start: "2026-07",
    type: "proj",
    project: "overload",
    title: "Overload on the App Store",
    org: "iOS app · Swift",
    text: "A minimal gym log with progression charts and Apple Health data.",
  },
  {
    id: "icib",
    start: "2026-05",
    type: "hack",
    place: 1,
    glyph: "trophy",
    title: "ItaliansCodeItBetter",
    org: "Team of 2 · 48 hours",
    text: "PreventivAI turns a client request, text or audio, into quote options. Hours come from past projects, costs from a fixed rate card, and a person signs off.",
  },
  {
    id: "gnam",
    start: "2026-02",
    end: "2026-07",
    type: "proj",
    project: "gnam",
    title: "GNAM!, my first startup",
    org: "iOS app · Flutter",
    text: "Recipes from what's in your pantry, expiry tracking, a pantry shared with the family. From idea to the App Store in 3 months, then closed: updating the pantry by hand cost users more than it gave back.",
  },
  {
    id: "freelance",
    start: "2026-02",
    ongoing: true,
    type: "work",
    glyph: "bag",
    title: "Freelance software developer",
    org: "2 clients · 11 projects",
    text: "Automations, desktop apps and scrapers for a cultural association and a loan broker.",
    link: { label: "Freelance", href: "/freelance" },
  },
  {
    id: "sciotem26",
    start: "2026-02",
    type: "hack",
    place: 2,
    glyph: "trophy",
    title: "SCIoTeM 2026",
    org: "Team of 3",
    text: "Smart Beam: the 60-day failure probability of every street light, with survival analysis and XGBoost, on a GIS map.",
  },
  {
    id: "sciotem25",
    start: "2025-02",
    type: "hack",
    place: 2,
    glyph: "trophy",
    title: "SCIoTeM 2025",
    org: "Team of 3",
    text: "P7M AI Summarizer: opens digitally signed .p7m documents and summarises them with an LLM.",
  },
  {
    id: "uni",
    start: "2024",
    ongoing: true,
    type: "edu",
    glyph: "cap",
    title: "BSc Computer Engineering",
    org: "University of Modena and Reggio Emilia",
    text: "Third year, every exam on schedule, graduating in 2027.",
  },
  {
    id: "adami",
    start: "2023-06",
    end: "2023-07",
    type: "work",
    glyph: "tool",
    title: "IT intern",
    org: "Adami Aldo Srl",
    text: "Installed point-of-sale systems and repaired printers and cash registers, working directly with customers.",
  },
  {
    id: "diploma",
    start: "2019",
    end: "2024",
    type: "edu",
    glyph: "school",
    title: "Diploma in Computer Science",
    org: "ITIS Enrico Fermi · 94/100",
    text: "Programming, databases, systems and networks, IT security.",
  },
];
