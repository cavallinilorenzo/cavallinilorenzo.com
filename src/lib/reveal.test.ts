import { describe, expect, it } from "vitest";
import {
  FAILSAFE_MS,
  JS_FLAG_SCRIPT,
  MAX_STEPS,
  STAGGER_MS,
  staggerDelays,
} from "./reveal";

function runFlagScript(rv: boolean) {
  let timer: (() => void) | undefined;
  let delay = 0;
  const dataset: Record<string, string> = {};
  const win = { __rv: rv };
  new Function("document", "window", "setTimeout", JS_FLAG_SCRIPT)(
    { documentElement: { dataset } },
    win,
    (fn: () => void, ms: number) => {
      timer = fn;
      delay = ms;
    },
  );
  const flagged = "js" in dataset;
  timer?.();
  return { flagged, after: "js" in dataset, delay };
}

describe("JS_FLAG_SCRIPT", () => {
  it("flags JS, then drops the flag after the failsafe delay if React never ran", () => {
    expect(runFlagScript(false)).toEqual({
      flagged: true,
      after: false,
      delay: FAILSAFE_MS,
    });
  });

  it("keeps the flag when MotionEffects has taken over", () => {
    expect(runFlagScript(true).after).toBe(true);
  });
});

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
