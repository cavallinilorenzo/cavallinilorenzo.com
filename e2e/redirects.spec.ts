import { expect, test } from "@playwright/test";

// Redirects are declared in next.config.ts and must be permanent (308).
// maxRedirects: 0 so we see the redirect itself, not its target.
const redirects: [string, string][] = [
  ["/startups", "/projects"],
  ["/events", "/experience"],
  ["/freelance/strongvilla", "/freelance"],
  ["/freelance/a/b", "/freelance"],
  ["/assets/cv.pdf", "/cv.pdf"],
];

test.describe("old URLs", () => {
  for (const [from, to] of redirects) {
    test(`${from} -> ${to} (308)`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      expect(new URL(res.headers()["location"], "http://x").pathname).toBe(to);
    });
  }

  test("/freelance itself stays a normal page", async ({ request }) => {
    const res = await request.get("/freelance", { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });

  test("/assets/cv.pdf ends on the CV as a PDF", async ({ request }) => {
    const res = await request.get("/assets/cv.pdf");
    expect(res.status()).toBe(200);
    expect(res.url()).toMatch(/\/cv\.pdf$/);
    expect(res.headers()["content-type"]).toContain("application/pdf");
  });
});
