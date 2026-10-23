import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ProjectPublicCard from "./ProjectPublicCard";
import type { ProjectPublicCard as ProjectPublicCardType } from "~/lib/api/types/project.types";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element; class?: string }) => (
    <a href={props.href} class={props.class}>{props.children}</a>
  ),
}));

const item = (
  overrides: Partial<ProjectPublicCardType> = {},
): ProjectPublicCardType => ({
  slug: "alpha",
  title: "Alpha",
  summary: "Summary",
  href: "/projects/alpha",
  projectType: "open_source",
  projectStatus: "completed",
  ...overrides,
});

describe("ProjectPublicCard", () => {
  it("renders cover image when coverUrl and alt are set", () => {
    render(() => (
      <ProjectPublicCard
        item={item({
          coverUrl: "https://cdn.example/cover.jpg",
          coverAlt: "Project cover",
        })}
      />
    ));

    const img = screen.getByRole("img", { name: "Project cover" });
    expect(img.getAttribute("src")).toBe("https://cdn.example/cover.jpg");
  });

  it("omits cover image when alt is missing", () => {
    render(() =>
      <ProjectPublicCard
        item={item({
          coverUrl: "https://cdn.example/cover.jpg",
          coverAlt: "  ",
        })}
      />,
    );

    expect(screen.queryByRole("img")).toBeNull();
  });
});
