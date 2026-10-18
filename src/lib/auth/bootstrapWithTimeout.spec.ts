import { afterEach, describe, expect, it, vi } from "vitest";
import { withTimeout } from "./bootstrapWithTimeout";

describe("withTimeout", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves when promise completes first", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 1000)).resolves.toBe("ok");
  });

  it("rejects when promise exceeds timeout", async () => {
    vi.useFakeTimers();
    const slow = new Promise<string>((resolve) => {
      setTimeout(() => resolve("late"), 20_000);
    });
    const result = withTimeout(slow, 100);
    vi.advanceTimersByTime(100);
    await expect(result).rejects.toThrow("Admin bootstrap timeout");
  });
});
