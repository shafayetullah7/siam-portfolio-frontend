import { render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import TimelineEntryMediaPanel from "./TimelineEntryMediaPanel";

const { get, replaceMedia } = vi.hoisted(() => ({
  get: vi.fn(),
  replaceMedia: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/timeline.api", () => ({
  adminTimelineApi: {
    get,
    replaceMedia,
  },
}));

vi.mock("./TimelineEntryMediaGallery", () => ({
  default: (props: {
    rows: { mediaId: string }[];
    onChange: (rows: unknown[]) => void;
    onDirty: () => void;
  }) => (
    <div>
      <button
        type="button"
        onClick={() => {
          props.onChange([
            {
              mediaId: "00000000-0000-4000-8000-000000000099",
              sortOrder: 0,
              caption: "Cap",
              imageRole: null,
            },
          ]);
          props.onDirty();
        }}
      >
        Mock edit gallery
      </button>
    </div>
  ),
}));

describe("TimelineEntryMediaPanel", () => {
  it("saves gallery with contiguous sortOrder via replaceMedia", async () => {
    get.mockResolvedValue({
      id: "entry-1",
      mediaLinks: [],
    });
    replaceMedia.mockResolvedValue({
      id: "entry-1",
      mediaLinks: [
        {
          id: "link-1",
          mediaId: "00000000-0000-4000-8000-000000000099",
          sortOrder: 0,
          caption: "Cap",
          imageRole: null,
        },
      ],
    });

    render(() => (
      <TimelineEntryMediaPanel
        entryId="00000000-0000-4000-8000-000000000088"
        kind="award"
      />
    ));

    await waitFor(() => {
      expect(screen.getByText("Mock edit gallery")).toBeTruthy();
    });

    screen.getByText("Mock edit gallery").click();
    screen.getByRole("button", { name: "Save gallery" }).click();

    await waitFor(() => {
      expect(replaceMedia).toHaveBeenCalledWith(
        "00000000-0000-4000-8000-000000000088",
        {
          items: [
            {
              mediaId: "00000000-0000-4000-8000-000000000099",
              sortOrder: 0,
              caption: "Cap",
              imageRole: null,
            },
          ],
        },
      );
    });
  });
});
