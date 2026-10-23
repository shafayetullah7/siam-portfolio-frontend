import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import WritingPublishChecklistDialog from "./WritingPublishChecklistDialog";

describe("WritingPublishChecklistDialog", () => {
  it("hides publish button when errors exist", () => {
    render(() => (
      <WritingPublishChecklistDialog
        open={true}
        pending={false}
        checklist={{
          errors: [{ code: "body_required", message: "Body is required" }],
          warnings: [],
        }}
        onClose={vi.fn()}
        onPublishAnyway={vi.fn()}
      />
    ));

    expect(screen.getByText("Body is required")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Publish" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Publish anyway" })).toBeNull();
  });

  it("shows Publish anyway when only warnings exist", () => {
    const onPublish = vi.fn();
    render(() => (
      <WritingPublishChecklistDialog
        open={true}
        pending={false}
        checklist={{
          errors: [],
          warnings: [{ code: "tags_missing", message: "No tags" }],
        }}
        onClose={vi.fn()}
        onPublishAnyway={onPublish}
      />
    ));

    const btn = screen.getByRole("button", { name: "Publish anyway" });
    fireEvent.click(btn);
    expect(onPublish).toHaveBeenCalled();
  });
});
