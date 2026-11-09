import { describe, expect, it } from "vitest";
import { COPY, PAGES, allStrings } from "./copy";

describe("PAGES metadata", () => {
  it("has the five routes", () => {
    expect(Object.keys(PAGES)).toEqual([
      "home",
      "projects",
      "links",
      "freelance",
      "experience",
    ]);
  });
  it("titles follow '<Page> · Lorenzo Cavallini', Home is bare", () => {
    expect(PAGES.home.title).toBe("Lorenzo Cavallini");
    for (const key of [
      "projects",
      "links",
      "freelance",
      "experience",
    ] as const) {
      expect(PAGES[key].title).toMatch(/^[A-Z][a-z]+ · Lorenzo Cavallini$/);
    }
  });
  it("keeps descriptions within 160 characters", () => {
    for (const page of Object.values(PAGES)) {
      expect(page.description.length).toBeGreaterThan(20);
      expect(page.description.length).toBeLessThanOrEqual(160);
    }
  });
});

describe("copy rules", () => {
  it("contains no em or en dash anywhere", () => {
    for (const s of allStrings()) {
      expect(s).not.toMatch(/[–—]/);
    }
  });
  it("has the shell strings from the copy prototype", () => {
    expect(COPY.ui.cv).toBe("Download CV");
    expect(COPY.footer.left).toBe("© 2026 Lorenzo Cavallini");
    expect(COPY.footer.right).toBe("Mantova, Italy");
  });
  it("has the Links and Freelance strings of voice M", () => {
    expect(COPY.ui.copyEmail).toBe("Copy email");
    expect(COPY.ui.copied).toBe("Email copied");
    expect(COPY.links.items.map((l) => l.name)).toEqual([
      "GitHub",
      "LinkedIn",
      "X",
      "Email",
    ]);
    // MIX rows come from voice A.
    expect(COPY.links.items[2].desc).toBe("Short posts while I build.");
    expect(COPY.links.items[3].desc).toBe(
      "The fastest way to reach me. Click to copy.",
    );
    expect(COPY.freelance.stats).toEqual([
      ["11", "projects delivered"],
      ["2", "clients"],
      ["Feb 2026", "freelancing since"],
    ]);
    expect(COPY.freelance.services).toHaveLength(3);
    expect(COPY.freelance.clients.map((c) => c.name)).toEqual([
      "Strongvilla",
      "A loan broker",
    ]);
    expect(COPY.freelance.endQ).toBe(
      "Still copying the same data by hand every week?",
    );
  });
  it("never claims a Notion and Google Calendar sync", () => {
    for (const s of allStrings()) expect(s).not.toMatch(/calendar/i);
  });
});
