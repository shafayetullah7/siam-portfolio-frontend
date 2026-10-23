import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import TimelinePublishControls from "./TimelinePublishControls";

const { publish, unpublish, getPublishCheck } = vi.hoisted(() => ({
  publish: vi.fn(),
  unpublish: vi.fn(),
  getPublishCheck: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/timeline.api", () => ({
  adminTimelineApi: {
    publish,
    unpublish,
    archive: vi.fn(),
    schedule: vi.fn(),
    getPublishCheck,
  },
}));

describe("TimelinePublishControls", () => {
  it("calls publish directly when checklist is clean", async () => {
    getPublishCheck.mockResolvedValue({ errors: [], warnings: [] });
    publish.mockResolvedValue({
      id: "entry-1",
      publishStatus: "published",
    });

    render(() => (
      <TimelinePublishControls
        entryId="entry-1"
        publishStatus="draft"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    await waitFor(() => {
      expect(getPublishCheck).toHaveBeenCalledWith("entry-1");
      expect(publish).toHaveBeenCalledWith("entry-1", { confirmWarnings: false });
    });
  });

  it("opens dialog and publishes with confirmWarnings when warnings exist", async () => {
    getPublishCheck.mockResolvedValue({
      errors: [],
      warnings: [{ code: "organization_missing", message: "No org" }],
    });
    publish.mockResolvedValue({
      id: "entry-1",
      publishStatus: "published",
    });

    render(() => (
      <TimelinePublishControls
        entryId="entry-1"
        publishStatus="draft"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => {
      expect(screen.getByText("No org")).toBeTruthy();
    });
    fireEvent.click(screen.getByRole("button", { name: "Publish anyway" }));

    await waitFor(() => {
      expect(publish).toHaveBeenCalledWith("entry-1", { confirmWarnings: true });
    });
  });

  it("shows Cancel schedule for scheduled status", () => {
    render(() => (
      <TimelinePublishControls
        entryId="entry-1"
        publishStatus="scheduled"
        variant="compact"
      />
    ));

    expect(screen.getByRole("button", { name: "Cancel schedule" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Publish now" })).toBeTruthy();
  });
});
