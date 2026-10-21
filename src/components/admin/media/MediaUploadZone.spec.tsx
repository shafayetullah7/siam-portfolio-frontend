import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import MediaUploadZone from "./MediaUploadZone";

describe("MediaUploadZone", () => {
  it("shows upload guidance", () => {
    render(() => <MediaUploadZone onUploaded={vi.fn()} />);
    expect(screen.getByText(/Drag an image or PDF here/i)).toBeTruthy();
    expect(screen.getByText(/Images up to 3 MB/i)).toBeTruthy();
  });
});
