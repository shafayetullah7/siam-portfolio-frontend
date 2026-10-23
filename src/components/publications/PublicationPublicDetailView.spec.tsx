import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationPublicDetailView from "./PublicationPublicDetailView";

vi.mock("@solidjs/router", async () => {
  const actual = await vi.importActual<typeof import("@solidjs/router")>(
    "@solidjs/router",
  );
  return {
    ...actual,
    A: (props: { href: string; children?: unknown }) => (
      <a href={props.href}>{props.children}</a>
    ),
  };
});

const detail = {
  slug: "my-paper",
  title: "My Paper Title",
  authorsShort: "Author A",
  year: 2024,
  venue: "NeurIPS",
  publicationType: "conference" as const,
  peerReviewed: true,
  abstract: "An abstract for preview.",
  href: "/publications/my-paper",
  availability: "publisher_link" as const,
};

describe("PublicationPublicDetailView", () => {
  it("renders title and abstract", () => {
    render(() => (
      <PublicationPublicDetailView
        detail={detail}
        backHref="/admin/publications/1"
        backLabel="Back"
        showPermalink={false}
      />
    ));

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "My Paper Title",
    );
    expect(screen.getByText("An abstract for preview.")).toBeTruthy();
    expect(screen.getByText("Abstract")).toBeTruthy();
    expect(screen.queryByText("Download PDF")).toBeNull();
  });

  it("renders supplement links and PDF when provided", () => {
    render(() => (
      <PublicationPublicDetailView
        detail={{
          ...detail,
          pdfHref: "https://cdn.example/paper.pdf",
          supplements: [
            {
              label: "Source code",
              url: "https://github.com/org/repo",
              kind: "code",
            },
          ],
        }}
        backHref="/publications"
        backLabel="Back"
      />
    ));

    expect(screen.getByText("Source code")).toBeTruthy();
    expect(screen.getByText("Download PDF")).toBeTruthy();
  });

  it("renders citation section when citation provided", () => {
    render(() => (
      <PublicationPublicDetailView
        detail={detail}
        backHref="/publications"
        backLabel="Back"
        citation={{
          citeKey: "my-paper",
          formatted: "Author A (2024). My Paper Title.",
          bibtex: "@misc{my-paper}",
        }}
      />
    ));

    expect(screen.getByRole("heading", { name: "Citation" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Copy formatted citation" }),
    ).toBeTruthy();
  });

  it("renders structured authors in order", () => {
    render(() => (
      <PublicationPublicDetailView
        detail={{
          ...detail,
          authors: [
            { name: "Alice", affiliation: "Lab A" },
            { name: "Bob", orcid: "0000-0001-2345-6789" },
          ],
        }}
        backHref="/publications"
        backLabel="Back to publications"
      />
    ));

    expect(screen.getByText("Authors")).toBeTruthy();
    const list = screen.getByRole("heading", { name: "Authors" })
      .nextElementSibling as HTMLElement;
    const items = list.querySelectorAll("li");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain("Alice");
    expect(items[0].textContent).toContain("Lab A");
    expect(items[1].textContent).toContain("Bob");
    expect(items[1].textContent).toContain("ORCID 0000-0001-2345-6789");
  });
});
