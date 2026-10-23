import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { ACHIEVEMENT_KINDS } from "~/lib/timeline/timeline-kind-groups";
import AdminAchievementsList from "./index";

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

vi.mock("~/lib/api/endpoints/admin/timeline.api", () => ({
  adminTimelineApi: {
    list,
  },
}));

function renderList() {
  return render(() => (
    <MetaProvider>
      <AdminAchievementsList />
    </MetaProvider>
  ));
}

describe("AdminAchievementsList", () => {
  it("renders empty achievements tab and requests P09 kinds", async () => {
    list.mockResolvedValue({
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
    expect(await screen.findByText("No achievements yet")).toBeTruthy();
    expect(list).toHaveBeenCalledWith(
      expect.objectContaining({
        kinds: [...ACHIEVEMENT_KINDS],
      }),
    );
  });
});
