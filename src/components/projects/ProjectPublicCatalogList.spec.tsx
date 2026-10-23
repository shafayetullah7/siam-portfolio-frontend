import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ProjectPublicCatalogList from "./ProjectPublicCatalogList";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element; class?: string }) => (
    <a href={props.href} class={props.class}>{props.children}</a>
  ),
}));
import type { ProjectPublicCard } from "~/lib/api/types/project.types";

const card = (overrides: Partial<ProjectPublicCard> = {}): ProjectPublicCard => ({
  slug: "alpha",
  title: "Alpha System",
  summary: "Summary",
  href: "/projects/alpha",
  projectType: "open_source",
  projectStatus: "completed",
  ...overrides,
});

describe("ProjectPublicCatalogList", () => {
  it("renders featured band and main grid", () => {
    render(() => (
      <ProjectPublicCatalogList
        featuredItems={[card({ slug: "featured-one", title: "Featured One", featured: true })]}
        items={[card({ slug: "other", title: "Other Project" })]}
      />
    ));

    expect(screen.getByRole("heading", { name: "Featured" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "All projects" })).toBeTruthy();
    expect(screen.getByText("Featured One")).toBeTruthy();
    expect(screen.getByText("Other Project")).toBeTruthy();
  });

  it("shows empty state when no items", () => {
    render(() => <ProjectPublicCatalogList items={[]} />);
    expect(screen.getByText("No projects published yet")).toBeTruthy();
  });
});
