import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminPublicationView from "./AdminPublicationView";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: unknown }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/endpoints/admin/publications.api", () => ({
  adminPublicationsApi: {
    citation: vi.fn().mockResolvedValue({
      citeKey: "paper",
      formatted: "Author (2024). Title.",
      bibtex: "@misc{paper}",
    }),
  },
}));

vi.mock("~/components/admin/publications/PublicationPublishControls", () => ({
  default: () => null,
}));

const publication = {
  id: "pub-1",
  slug: "paper",
  title: "Title",
  authorsShort: "Author",
  authors: [{ sortOrder: 0, name: "Author" }],
  year: 2024,
  venue: "Venue",
  significance: null,
  abstract: null,
  publicationType: "journal" as const,
  peerReviewed: false,
  doi: null,
  publisherUrl: null,
  featured: false,
  featuredOnHome: false,
  seoTitle: null,
  seoDescription: null,
  ownerContribution: null,
  correctionNotice: null,
  hideFromSearch: false,
  publishStatus: "draft" as const,
  publishedAt: null,
  scheduledAt: null,
  archivedAt: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("AdminPublicationView", () => {
  it("shows citation preview with formatted text", async () => {
    render(() => <AdminPublicationView publication={publication} />);
    expect(await screen.findByText("Citation preview")).toBeTruthy();
    expect(await screen.findByText("Author (2024). Title.")).toBeTruthy();
  });
});
