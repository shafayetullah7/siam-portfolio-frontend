import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import WritingPreviewPane from "./WritingPreviewPane";

describe("WritingPreviewPane", () => {
  it("renders markdown heading in preview", () => {
    render(() => (
      <WritingPreviewPane showPreview body="## Preview section" />
    ));
    expect(
      screen.queryByText(/raw Markdown until rich rendering/i),
    ).toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Preview section" }),
    ).toBeTruthy();
  });
});
