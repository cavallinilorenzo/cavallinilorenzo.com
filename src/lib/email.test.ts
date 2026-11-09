import { describe, expect, it, vi } from "vitest";
import { EMAIL, MAILTO, copyEmail } from "./email";

describe("email", () => {
  it("is the public address", () => {
    expect(EMAIL).toBe("hello@cavallinilorenzo.com");
    expect(MAILTO).toBe("mailto:hello@cavallinilorenzo.com");
  });

  it("writes the address to the clipboard and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await copyEmail({ writeText })).toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello@cavallinilorenzo.com");
  });

  it("reports failure when the clipboard rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    expect(await copyEmail({ writeText })).toBe(false);
  });

  it("reports failure when there is no clipboard", async () => {
    expect(await copyEmail(undefined)).toBe(false);
  });
});
