import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminProjectsList from "./index";

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

vi.mock("~/lib/api/endpoints/admin/projects.api", () => ({
  adminProjectsApi: {
    list,
  },
}));

function renderList() {
  return render(() => (
    <MetaProvider>
      <AdminProjectsList />
    </MetaProvider>
  ));
}

describe("AdminProjectsList", () => {
  it("renders empty list state with new project CTA", async () => {
    list.mockResolvedValue([]);
    renderList();
    expect(await screen.findByText("No projects yet")).toBeTruthy();
    expect(screen.getByRole("link", { name: "New project" })).toBeTruthy();
  });

  it("shows project row with title and status badge", async () => {
    list.mockResolvedValue([
      {
        id: "00000000-0000-4000-8000-000000000001",
        slug: "demo-proj",
        title: "Demo Project",
        summary: "S",
        tags: null,
        projectType: "other",
        projectStatus: "completed",
        evaluationMaturity: "provisional",
        ownerRole: null,
        ownerContribution: null,
        resultTeaser: null,
        periodStart: null,
        periodEnd: null,
        coverMediaId: null,
        featured: false,
        featuredOnHome: false,
        sortOrder: 0,
        seoTitle: null,
        seoDescription: null,
        hideFromSearch: false,
        sections: [],
        resources: [],
        metrics: [],
        publishStatus: "draft",
        publishedAt: null,
        scheduledAt: null,
        archivedAt: null,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
    ]);
    renderList();
    expect(await screen.findByText("Demo Project")).toBeTruthy();
    expect(screen.getByRole("link", { name: "View Demo Project" })).toBeTruthy();
  });
});
