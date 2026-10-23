import { render, screen, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach } from "vitest";
import PublicationImportWizard from "./PublicationImportWizard";

const importPreview = vi.fn();
const importConfirm = vi.fn();
const getPublication = vi.fn();
const navigate = vi.fn();

vi.mock("~/lib/api/endpoints/admin/publications.api", () => ({
  adminPublicationsApi: {
    importPreview: (...args: unknown[]) => importPreview(...args),
    importConfirm: (...args: unknown[]) => importConfirm(...args),
    get: (...args: unknown[]) => getPublication(...args),
  },
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    A: (props: { href: string; children?: unknown; class?: string }) => (
      <a href={props.href} class={props.class}>{props.children}</a>
    ),
    useNavigate: () => navigate,
  };
});

describe("PublicationImportWizard", () => {
  beforeEach(() => {
    importPreview.mockReset();
    importConfirm.mockReset();
    getPublication.mockReset();
    navigate.mockReset();
    importConfirm.mockResolvedValue({ id: "new-id" });
  });

  it("does not call confirm until user clicks confirm", async () => {
    importPreview.mockResolvedValue({
      source: "bibtex",
      proposed: {
        slug: "example",
        title: "Example",
        authors: [{ name: "A" }],
        year: 2025,
        venue: "Venue",
        publicationType: "journal",
      },
      duplicates: [],
      parseWarnings: [],
      lowConfidenceFields: [],
    });

    render(() => <PublicationImportWizard />);
    fireEvent.input(screen.getByPlaceholderText("@article{...}"), {
      target: { value: "@article{x}" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Preview import" }));

    expect(await screen.findByText("Proposed fields")).toBeTruthy();
    expect(importConfirm).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Confirm import" }));
    await vi.waitFor(() => expect(importConfirm).toHaveBeenCalledTimes(1));
  });

  it("shows merge field toggles when duplicates exist", async () => {
    getPublication.mockResolvedValue({
      id: "00000000-0000-4000-8000-000000000001",
      title: "Existing title",
      authors: [{ sortOrder: 0, name: "Author" }],
      year: 2025,
      venue: "Venue",
      abstract: null,
      significance: null,
      publicationType: "journal",
      peerReviewed: false,
      doi: null,
      publisherUrl: null,
      seoTitle: null,
      seoDescription: null,
    });
    importPreview.mockResolvedValue({
      source: "bibtex",
      proposed: {
        slug: "example",
        title: "Example",
        authors: [{ name: "A" }],
        year: 2025,
        venue: "Venue",
        publicationType: "journal",
      },
      duplicates: [
        {
          id: "00000000-0000-4000-8000-000000000001",
          slug: "existing",
          title: "Existing",
          year: 2025,
          doi: null,
          matchReason: "title_year",
        },
      ],
      parseWarnings: [],
      lowConfidenceFields: [],
    });

    render(() => <PublicationImportWizard />);
    fireEvent.input(screen.getByPlaceholderText("@article{...}"), {
      target: { value: "@article{x}" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Preview import" }));

    expect(await screen.findByText("Possible duplicates")).toBeTruthy();
    expect(screen.getByText("Merge fields")).toBeTruthy();
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });
});
