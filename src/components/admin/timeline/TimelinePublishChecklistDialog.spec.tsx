import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import TimelinePublishChecklistDialog from "./TimelinePublishChecklistDialog";

vi.mock("~/components/admin/AdminDialog", () => ({
  default: (props: {
    open: boolean;
    children?: unknown;
    footer?: unknown;
  }) =>
    props.open ? (
      <div>
        {props.children}
        {props.footer}
      </div>
    ) : null,
}));

describe("TimelinePublishChecklistDialog", () => {
  it("shows errors and hides publish button", () => {
    render(() => (
      <TimelinePublishChecklistDialog
        open
        pending={false}
        checklist={{
          errors: [{ code: "title_required", message: "Title is required" }],
          warnings: [],
        }}
        onClose={vi.fn()}
        onPublishAnyway={vi.fn()}
      />
    ));
    expect(screen.getByText("Title is required")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Publish" })).toBeNull();
  });

  it("shows warnings and publish anyway", () => {
    render(() => (
      <TimelinePublishChecklistDialog
        open
        pending={false}
        checklist={{
          errors: [],
          warnings: [{ code: "proof_url_missing", message: "Add proof" }],
        }}
        onClose={vi.fn()}
        onPublishAnyway={vi.fn()}
      />
    ));
    expect(screen.getByText("Add proof")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Publish anyway" })).toBeTruthy();
  });
});
