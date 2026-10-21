import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import ResearchPublishChecklistDialog from "./ResearchPublishChecklistDialog";

describe("ResearchPublishChecklistDialog", () => {
  it("shows errors and hides publish button", () => {
    render(() => (
      <ResearchPublishChecklistDialog
        open={true}
        pending={false}
        checklist={{
          errors: [{ code: "title_required", message: "Title is required" }],
          warnings: [],
        }}
        onClose={() => {}}
        onPublishAnyway={() => {}}
      />
    ));
    expect(screen.getByText("Title is required")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Publish anyway" })).toBeNull();
  });

  it("calls onPublishAnyway for warnings", () => {
    const onPublish = vi.fn();
    render(() => (
      <ResearchPublishChecklistDialog
        open={true}
        pending={false}
        checklist={{
          errors: [],
          warnings: [{ code: "ongoing_has_findings", message: "Review findings" }],
        }}
        onClose={() => {}}
        onPublishAnyway={onPublish}
      />
    ));
    screen.getByRole("button", { name: "Publish anyway" }).click();
    expect(onPublish).toHaveBeenCalled();
  });
});
