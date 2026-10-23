import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import PublicationCatalogList from "./PublicationCatalogList";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element; class?: string }) => (
    <a href={props.href} class={props.class}>{props.children}</a>
  ),
}));

describe("PublicationCatalogList", () => {
  it("renders publication title from API card", () => {
    render(() => (
      <PublicationCatalogList
        items={[
          {
            slug: "live-paper",
            title: "API Paper Title",
            authorsShort: "Author A",
            year: 2024,
            venue: "NeurIPS",
            publicationType: "conference",
            featured: true,
            href: "/publications/live-paper",
            availability: "publisher_link",
          },
        ]}
      />
    ));
    expect(screen.getByText("API Paper Title")).toBeTruthy();
    expect(screen.getByText("Featured")).toBeTruthy();
  });

  it("groups items by year when enabled", () => {
    render(() => (
      <PublicationCatalogList
        groupByYear
        items={[
          {
            slug: "a",
            title: "Paper A",
            authorsShort: "A",
            year: 2023,
            venue: "Venue",
            publicationType: "journal",
            featured: false,
            href: "/publications/a",
            availability: "no_pdf",
          },
          {
            slug: "b",
            title: "Paper B",
            authorsShort: "B",
            year: 2024,
            venue: "Venue",
            publicationType: "journal",
            featured: false,
            href: "/publications/b",
            availability: "open_access",
          },
        ]}
      />
    ));
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.map((h) => h.textContent)).toEqual(["2024", "2023"]);
  });

  it("shows empty state when no items", () => {
    render(() => <PublicationCatalogList items={[]} />);
    expect(screen.getByText("No publications yet")).toBeTruthy();
  });
});
