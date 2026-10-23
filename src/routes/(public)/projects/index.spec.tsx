import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ProjectsIndex from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockList = {
  intro: null,
  items: [
    {
      slug: "from-api",
      title: "From API List",
      summary: "Summary",
      href: "/projects/from-api",
      projectType: "open_source" as const,
      projectStatus: "completed" as const,
    },
  ],
  meta: {
    page: 1,
    limit: 24,
    itemCount: 1,
    total: 1,
    totalPages: 1,
  },
};

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    if (key.includes("featured: true")) {
      return () => null;
    }
    return () => mockList;
  },
  useSearchParams: () => [{}, vi.fn()],
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicProjects: () => Promise.resolve(mockList),
}));

describe("ProjectsIndex route", () => {
  it("renders projects from public API with total count", () => {
    render(() => (
      <MetaProvider>
        <ProjectsIndex />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { level: 1, name: /Projects/i })).toBeTruthy();
    expect(screen.getByText("From API List")).toBeTruthy();
    expect(screen.getByText("1 project")).toBeTruthy();
  });
});
