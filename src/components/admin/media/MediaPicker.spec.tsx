import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import MediaPicker from "./MediaPicker";

vi.mock("~/lib/api/endpoints/admin/media.api", () => ({
  adminMediaApi: {
    list: vi.fn().mockResolvedValue({
      items: [
        {
          id: "media-1",
          fileName: "icon.png",
          url: "https://cdn.example/icon.png",
          mimeType: "image/png",
          size: 100,
          alt: "Site icon",
          caption: null,
          license: null,
          usesCount: 0,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      meta: {
        page: 1,
        limit: 24,
        itemCount: 1,
        total: 1,
        totalPages: 1,
      },
    }),
    get: vi.fn(),
    uploadImage: vi.fn(),
  },
}));

describe("MediaPicker", () => {
  it("calls onSelect with id, url, and alt when confirming selection", async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();

    render(() => (
      <MediaPicker open onClose={onClose} onSelect={onSelect} imagesOnly />
    ));

    const fileButton = await screen.findByText("icon.png");
    fileButton.closest("button")?.click();

    screen.getByRole("button", { name: "Use selected" }).click();

    await vi.waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith({
        id: "media-1",
        url: "https://cdn.example/icon.png",
        alt: "Site icon",
      });
    });
    expect(onClose).toHaveBeenCalled();
  });
});
