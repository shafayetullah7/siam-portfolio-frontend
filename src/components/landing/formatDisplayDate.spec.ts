import { describe, expect, it } from "vitest";
import { formatDisplayDate } from "./formatDisplayDate";

describe("formatDisplayDate", () => {
  it("formats ISO date strings", () => {
    expect(formatDisplayDate("2026-10-01")).toBe("October 1, 2026");
  });

  it("returns raw input when parsing fails", () => {
    expect(formatDisplayDate("not-a-date")).toBe("not-a-date");
  });
});
