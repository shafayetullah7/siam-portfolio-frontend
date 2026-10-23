import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationEditorForm from "./PublicationEditorForm";

const { navigate, create } = vi.hoisted(() => ({
  navigate: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@solidjs/router", async () => {
  const actual = await vi.importActual<typeof import("@solidjs/router")>(
    "@solidjs/router",
  );
  return {
    ...actual,
    useNavigate: () => navigate,
    A: (props: { href: string; children?: unknown }) => (
      <a href={props.href}>{props.children}</a>
    ),
  };
});

vi.mock("~/lib/api/endpoints/admin/publications.api", () => ({
  adminPublicationsApi: {
    create,
    update: vi.fn(),
  },
}));

describe("PublicationEditorForm", () => {
  it("submits create with required fields", async () => {
    create.mockResolvedValue({
      id: "pub-1",
      slug: "my-paper",
      title: "My Paper",
      authorsShort: "Author A",
      authors: [{ sortOrder: 0, name: "Author A" }],
      year: 2024,
      venue: "NeurIPS",
      publicationType: "conference",
      peerReviewed: false,
      featured: false,
      featuredOnHome: false,
      hideFromSearch: false,
      publishStatus: "draft",
      significance: null,
      abstract: null,
      doi: null,
      publisherUrl: null,
      seoTitle: null,
      seoDescription: null,
      ownerContribution: null,
      correctionNotice: null,
      publishedAt: null,
      scheduledAt: null,
      archivedAt: null,
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: "2026-10-01T00:00:00Z",
    });

    render(() => <PublicationEditorForm mode="create" />);

    const titleInput = document.querySelector(
      'input[name="title"]',
    ) as HTMLInputElement;
    const authorsInput = document.querySelector(
      'input[name="author-name-0"]',
    ) as HTMLInputElement;
    const venueInput = document.querySelector(
      'input[name="venue"]',
    ) as HTMLInputElement;

    fireEvent.input(titleInput, { target: { value: "My Paper" } });
    fireEvent.input(authorsInput, { target: { value: "Author A" } });
    fireEvent.input(venueInput, { target: { value: "NeurIPS" } });

    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));

    await waitFor(() => {
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My Paper",
          authors: [{ name: "Author A", affiliation: null, orcid: null }],
          venue: "NeurIPS",
          slug: "my-paper",
        }),
      );
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/admin/publications/pub-1");
    });
  });
});
