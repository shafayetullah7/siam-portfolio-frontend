import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import TimelineEntryMediaGallery from "./TimelineEntryMediaGallery";
import type { TimelineGalleryRow } from "~/lib/timeline/timeline-gallery";

vi.mock("~/components/admin/media/MediaPicker", () => ({
  default: () => null,
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    A: (props: { href: string; children?: unknown }) => (
      <a href={props.href}>{props.children}</a>
    ),
  };
});

const baseRows: TimelineGalleryRow[] = [
  {
    mediaId: "00000000-0000-4000-8000-000000000001",
    sortOrder: 0,
    caption: null,
    imageRole: null,
    url: "https://example.com/a.jpg",
    alt: "First",
  },
  {
    mediaId: "00000000-0000-4000-8000-000000000002",
    sortOrder: 1,
    caption: null,
    imageRole: null,
    url: "https://example.com/b.jpg",
    alt: "Second",
  },
];

describe("TimelineEntryMediaGallery", () => {
  it("reorders rows when Down is clicked on the first item", async () => {
    const onChange = vi.fn();
    render(() => (
      <TimelineEntryMediaGallery
        rows={baseRows}
        kind="award"
        onChange={onChange}
        onDirty={vi.fn()}
      />
    ));

    const downButtons = await screen.findAllByRole("button", { name: "Down" });
    downButtons[0].click();

    expect(onChange).toHaveBeenCalled();
    const next = onChange.mock.calls.at(-1)?.[0] as TimelineGalleryRow[];
    expect(next[0].mediaId).toBe(baseRows[1].mediaId);
    expect(next[1].mediaId).toBe(baseRows[0].mediaId);
    expect(next[0].sortOrder).toBe(0);
    expect(next[1].sortOrder).toBe(1);
  });

  it("shows alt warning when alt is missing", async () => {
    render(() => (
      <TimelineEntryMediaGallery
        rows={[
          {
            ...baseRows[0],
            alt: "",
          },
        ]}
        kind="award"
        onChange={vi.fn()}
        onDirty={vi.fn()}
      />
    ));

    expect(await screen.findByText(/Missing alt text/i)).toBeTruthy();
  });
});
