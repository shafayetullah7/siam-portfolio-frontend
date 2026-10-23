import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminWritingList from "./index";

const { list } = vi.hoisted(() => ({
  list: vi.fn(),
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    A: (props: { href: string; children?: unknown; class?: string }) => (
      <a href={props.href} class={props.class}>{props.children}</a>
    ),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("~/lib/api/endpoints/admin/writing.api", () => ({
  adminWritingApi: {
    list,
  },
}));

function renderList() {
  return render(() => (
    <MetaProvider>
      <AdminWritingList />
    </MetaProvider>
  ));
}

describe("AdminWritingList", () => {
  it("renders empty list state with new article CTA", async () => {
    list.mockResolvedValue({
      intro: null,
      items: [],
      meta: {
        page: 1,
        limit: 24,
        itemCount: 0,
        total: 0,
        totalPages: 0,
      },
    });
    renderList();
    expect(await screen.findByText("No articles yet")).toBeTruthy();
    expect(screen.getByRole("link", { name: "New article" })).toBeTruthy();
  });

  it("shows article row with title", async () => {
    list.mockResolvedValue({
      intro: null,
      items: [
        {
          id: "00000000-0000-4000-8000-000000000001",
          slug: "demo-article",
          title: "Demo Article",
          publishStatus: "draft",
          updatedAt: "2024-01-02T00:00:00.000Z",
          readingTimeMinutes: 3,
          tags: ["essay"],
        },
      ],
      meta: {
        page: 1,
        limit: 24,
        itemCount: 1,
        total: 1,
        totalPages: 1,
      },
    });
    renderList();
    expect(await screen.findByText("Demo Article")).toBeTruthy();
    expect(screen.getByRole("link", { name: "View Demo Article" })).toBeTruthy();
  });
});
