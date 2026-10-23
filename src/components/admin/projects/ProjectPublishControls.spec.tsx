import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import ProjectPublishControls from "./ProjectPublishControls";

const { publish, unpublish, getPublishCheck } = vi.hoisted(() => ({
  publish: vi.fn(),
  unpublish: vi.fn(),
  getPublishCheck: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/projects.api", () => ({
  adminProjectsApi: {
    publish,
    unpublish,
    archive: vi.fn(),
    schedule: vi.fn(),
    getPublishCheck,
  },
}));

describe("ProjectPublishControls", () => {
  it("calls publish directly when checklist is clean", async () => {
    getPublishCheck.mockResolvedValue({ errors: [], warnings: [] });
    publish.mockResolvedValue({
      id: "proj-1",
      publishStatus: "published",
    });

    render(() => (
      <ProjectPublishControls
        projectId="proj-1"
        publishStatus="draft"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    await waitFor(() => {
      expect(getPublishCheck).toHaveBeenCalledWith("proj-1");
      expect(publish).toHaveBeenCalledWith("proj-1", { confirmWarnings: false });
    });
  });

  it("opens dialog and publishes with confirmWarnings when warnings exist", async () => {
    getPublishCheck.mockResolvedValue({
      errors: [],
      warnings: [{ code: "no_repo_or_demo", message: "No repo" }],
    });
    publish.mockResolvedValue({
      id: "proj-1",
      publishStatus: "published",
    });

    render(() => (
      <ProjectPublishControls
        projectId="proj-1"
        publishStatus="draft"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => {
      expect(screen.getByText("No repo")).toBeTruthy();
    });
    fireEvent.click(screen.getByRole("button", { name: "Publish anyway" }));

    await waitFor(() => {
      expect(publish).toHaveBeenCalledWith("proj-1", { confirmWarnings: true });
    });
  });

  it("shows Unpublish for published", () => {
    render(() => (
      <ProjectPublishControls
        projectId="proj-1"
        publishStatus="published"
        variant="compact"
      />
    ));

    expect(screen.getByRole("button", { name: "Unpublish" })).toBeTruthy();
  });
});
