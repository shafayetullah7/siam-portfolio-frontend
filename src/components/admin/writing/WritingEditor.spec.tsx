import { MetaProvider } from "@solidjs/meta";
import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import WritingEditor from "./WritingEditor";

const { get, update } = vi.hoisted(() => ({
  get: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@solidjs/router", async () => {
  const actual = await vi.importActual<typeof import("@solidjs/router")>(
    "@solidjs/router",
  );
  return {
    ...actual,
    useSubmission: () => ({ result: undefined, error: undefined, pending: false }),
    A: (props: { href: string; children?: unknown }) => (
      <a href={props.href}>{props.children}</a>
    ),
  };
});

vi.mock("~/components/admin/media/MediaPicker", () => ({
  default: () => null,
}));

vi.mock("~/lib/api/endpoints/admin/writing.api", () => ({
  adminWritingApi: {
    get,
    update,
  },
}));

const articleDetail = {
  id: "00000000-0000-4000-8000-000000000099",
  slug: "my-article",
  title: "My Article",
  subtitle: null,
  summary: "Summary text",
  body: "Hello",
  tags: null,
  seriesId: null,
  seriesSortOrder: null,
  coverMediaId: null,
  byline: null,
  readingTimeMinutes: 1,
  wordCount: 1,
  featuredOnHub: false,
  featured: false,
  sortOrder: 0,
  materiallyUpdatedAt: null,
  seoTitle: null,
  seoDescription: null,
  hideFromSearch: false,
  publishStatus: "draft" as const,
  publishedAt: null,
  scheduledAt: null,
  archivedAt: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("WritingEditor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    get.mockResolvedValue(articleDetail);
    update.mockResolvedValue({
      ...articleDetail,
      body: "Hello world",
      updatedAt: "2024-01-02T00:00:00.000Z",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("loads edit form and autosaves after debounce", async () => {
    render(() => (
      <MetaProvider>
        <WritingEditor articleId={articleDetail.id} />
      </MetaProvider>
    ));

    expect(await screen.findByDisplayValue("My Article")).toBeTruthy();

    const body = await screen.findByDisplayValue("Hello");
    fireEvent.input(body, { target: { value: "Hello world" } });

    await vi.advanceTimersByTimeAsync(2600);

    await waitFor(() => {
      expect(update).toHaveBeenCalledTimes(1);
    });
  });
});
