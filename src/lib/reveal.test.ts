import { describe, expect, it } from "vitest";
import { MAX_STEPS, STAGGER_MS, staggerDelays } from "./reveal";

describe("staggerDelays", () => {
  it("steps cards by 70 ms in order", () => {
    expect(STAGGER_MS).toBe(70);
    expect(staggerDelays([true, true, true])).toEqual([0, 70, 140]);
  });

  it("leaves non-card blocks undelayed and does not count them", () => {
    expect(staggerDelays([false, true, false, true])).toEqual([0, 0, 0, 70]);
  });

  it("caps the wait so a long batch never lags", () => {
    const delays = staggerDelays(Array(20).fill(true));
    expect(Math.max(...delays)).toBe(MAX_STEPS * STAGGER_MS);
  });

  it("handles an empty batch", () => {
    expect(staggerDelays([])).toEqual([]);
  });
});
