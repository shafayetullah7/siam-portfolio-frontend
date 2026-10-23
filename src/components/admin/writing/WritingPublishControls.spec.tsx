import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import WritingPublishControls from "./WritingPublishControls";

const { publish, unpublish, getPublishCheck } = vi.hoisted(() => ({
  publish: vi.fn(),
  unpublish: vi.fn(),
  getPublishCheck: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/writing.api", () => ({
  adminWritingApi: {
    publish,
    unpublish,
    archive: vi.fn(),
    schedule: vi.fn(),
    getPublishCheck,
  },
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    revalidate: vi.fn(),
  };
});

describe("WritingPublishControls", () => {
  it("calls publish directly when checklist is clean", async () => {
    getPublishCheck.mockResolvedValue({ errors: [], warnings: [] });
    publish.mockResolvedValue({
      id: "art-1",
      publishStatus: "published",
    });

    render(() => (
      <WritingPublishControls
        articleId="art-1"
        publishStatus="draft"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    await waitFor(() => {
      expect(getPublishCheck).toHaveBeenCalledWith("art-1");
      expect(publish).toHaveBeenCalledWith("art-1", { confirmWarnings: false });
    });
  });

  it("opens dialog and publishes with confirmWarnings when warnings exist", async () => {
    getPublishCheck.mockResolvedValue({
      errors: [],
      warnings: [{ code: "tags_missing", message: "No tags" }],
    });
    publish.mockResolvedValue({
      id: "art-1",
      publishStatus: "published",
    });

    render(() => (
      <WritingPublishControls
        articleId="art-1"
        publishStatus="draft"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await waitFor(() => {
      expect(screen.getByText("No tags")).toBeTruthy();
    });
    fireEvent.click(screen.getByRole("button", { name: "Publish anyway" }));

    await waitFor(() => {
      expect(publish).toHaveBeenCalledWith("art-1", { confirmWarnings: true });
    });
  });

  it("calls unpublish on Unpublish click", async () => {
    unpublish.mockResolvedValue({
      id: "art-1",
      publishStatus: "draft",
    });

    render(() => (
      <WritingPublishControls
        articleId="art-1"
        publishStatus="published"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Unpublish" }));

    await waitFor(() => {
      expect(unpublish).toHaveBeenCalledWith("art-1");
    });
  });
});
