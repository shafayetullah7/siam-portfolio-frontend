import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminPublicationsList from "./index";

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

vi.mock("~/lib/api/endpoints/admin/publications.api", () => ({
  adminPublicationsApi: {
    list,
  },
}));

vi.mock("~/components/admin/publications/PublicationPublishControls", () => ({
  default: () => <span data-testid="publish-controls" />,
}));

function renderList() {
  return render(() => (
    <MetaProvider>
      <AdminPublicationsList />
    </MetaProvider>
  ));
}

describe("AdminPublicationsList", () => {
  it("renders empty list state with new publication CTA", async () => {
    list.mockResolvedValue([]);
    renderList();
    expect(await screen.findByText("No publications yet")).toBeTruthy();
    expect(screen.getByRole("link", { name: "New publication" })).toBeTruthy();
  });

  it("shows duplicate hint badge when duplicateHint is true", async () => {
    list.mockResolvedValue([
      {
        id: "00000000-0000-4000-8000-000000000001",
        slug: "paper-a",
        title: "Paper A",
        authorsShort: "Author",
        authors: [{ sortOrder: 0, name: "Author" }],
        year: 2024,
        venue: "Venue",
        significance: null,
        abstract: null,
        publicationType: "journal",
        peerReviewed: false,
        doi: "10.1/a",
        publisherUrl: null,
        featured: false,
        featuredOnHome: false,
        seoTitle: null,
        seoDescription: null,
        ownerContribution: null,
        correctionNotice: null,
        hideFromSearch: false,
        publishStatus: "draft",
        publishedAt: null,
        scheduledAt: null,
        archivedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        duplicateHint: true,
      },
    ]);

    renderList();
    expect(await screen.findByText("Duplicate hint")).toBeTruthy();
  });
});
