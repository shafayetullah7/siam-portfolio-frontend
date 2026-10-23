import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationPublishChecklistDialog from "./PublicationPublishChecklistDialog";

describe("PublicationPublishChecklistDialog", () => {
  it("shows errors and hides publish button", () => {
    render(() => (
      <PublicationPublishChecklistDialog
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
      <PublicationPublishChecklistDialog
        open={true}
        pending={false}
        checklist={{
          errors: [],
          warnings: [{ code: "doi_missing", message: "No DOI" }],
        }}
        onClose={() => {}}
        onPublishAnyway={onPublish}
      />
    ));
    screen.getByRole("button", { name: "Publish anyway" }).click();
    expect(onPublish).toHaveBeenCalled();
  });
});
