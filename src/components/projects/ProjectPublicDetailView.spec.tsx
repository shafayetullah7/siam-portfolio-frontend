import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ProjectPublicDetailView from "./ProjectPublicDetailView";
import type { ProjectPublicDetail } from "~/lib/api/types/project.types";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

const detail = (overrides: Partial<ProjectPublicDetail> = {}): ProjectPublicDetail => ({
  slug: "alpha",
  title: "Alpha Project",
  summary: "Summary",
  href: "/projects/alpha",
  projectType: "open_source",
  projectStatus: "completed",
  evaluationMaturity: "provisional",
  featured: false,
  sections: [],
  resources: [],
  metrics: [],
  ...overrides,
});

describe("ProjectPublicDetailView", () => {
  it("renders related publications when present", () => {
    render(() => (
      <ProjectPublicDetailView
        detail={detail({
          related: {
            themes: [],
            publications: [
              {
                slug: "paper-one",
                title: "Paper One",
                authorsShort: "A. Author",
                year: 2024,
                venue: "ICML",
                href: "/publications/paper-one",
              },
            ],
          },
        })}
      />
    ));
    expect(screen.getByRole("heading", { name: "Related publications" })).toBeTruthy();
    expect(screen.getByText("Paper One")).toBeTruthy();
  });
});
