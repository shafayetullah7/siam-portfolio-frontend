import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationPublishControls from "./PublicationPublishControls";

const { publish, unpublish, getPublishCheck } = vi.hoisted(() => ({
  publish: vi.fn(),
  unpublish: vi.fn(),
  getPublishCheck: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/publications.api", () => ({
  adminPublicationsApi: {
    publish,
    unpublish,
    archive: vi.fn(),
    schedule: vi.fn(),
    getPublishCheck,
  },
}));

vi.mock("@solidjs/router", async () => {
  const actual = await vi.importActual<typeof import("@solidjs/router")>(
    "@solidjs/router",
  );
  return {
    ...actual,
    revalidate: vi.fn(),
  };
});

describe("PublicationPublishControls", () => {
  it("shows Publish for draft and calls API when checklist is clean", async () => {
    getPublishCheck.mockResolvedValue({ errors: [], warnings: [] });
    publish.mockResolvedValue({
      id: "pub-1",
      publishStatus: "published",
    });

    render(() => (
      <PublicationPublishControls
        publicationId="pub-1"
        publishStatus="draft"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    await waitFor(() => {
      expect(getPublishCheck).toHaveBeenCalledWith("pub-1");
      expect(publish).toHaveBeenCalledWith("pub-1", { confirmWarnings: false });
    });
  });

  it("confirms warnings before publish", async () => {
    getPublishCheck.mockResolvedValue({
      errors: [],
      warnings: [{ code: "doi_missing", message: "No DOI" }],
    });
    publish.mockResolvedValue({
      id: "pub-1",
      publishStatus: "published",
    });

    render(() => (
      <PublicationPublishControls
        publicationId="pub-1"
        publishStatus="draft"
        variant="compact"
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Publish" }));

    await waitFor(() => {
      expect(screen.getByText("No DOI")).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: "Publish anyway" }));

    await waitFor(() => {
      expect(publish).toHaveBeenCalledWith("pub-1", { confirmWarnings: true });
    });
  });

  it("shows Unpublish for published", () => {
    render(() => (
      <PublicationPublishControls
        publicationId="pub-1"
        publishStatus="published"
        variant="compact"
      />
    ));

    expect(screen.getByRole("button", { name: "Unpublish" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Publish" })).toBeNull();
  });
});
