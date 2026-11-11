import { describe, expect, it } from "vitest";
import {
  formatTalkDateTime,
  formatTalkDateTimePreview,
} from "./formatTalkDateTime";

describe("formatTalkDateTimePreview", () => {
  it("formats in the given IANA timezone", () => {
    const preview = formatTalkDateTimePreview(
      "2026-06-15T14:30:00.000Z",
      "UTC",
    );
    expect(preview).toBeTruthy();
    expect(preview).toMatch(/Jun/);
  });

  it("formatTalkDateTime returns formatted text and timezone label", () => {
    const result = formatTalkDateTime(
      "2026-06-15T14:30:00.000Z",
      "America/New_York",
    );
    expect(result).toBeTruthy();
    expect(result!.formatted).toMatch(/Jun/);
    expect(result!.timezoneLabel.length).toBeGreaterThan(0);
  });
});
