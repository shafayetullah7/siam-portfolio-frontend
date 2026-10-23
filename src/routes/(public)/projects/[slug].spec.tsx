import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { ProjectPublicDetail } from "~/lib/api/types/project.types";
import ProjectDetail from "./[slug]";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockDetail: ProjectPublicDetail = {
  slug: "live-proj",
  title: "Live Project",
  summary: "Summary from API.",
  href: "/projects/live-proj",
  projectType: "open_source",
  projectStatus: "completed",
  evaluationMaturity: "provisional",
  featured: false,
  sections: [
    { kind: "problem", body: "Problem text", sortOrder: 0 },
  ],
  resources: [],
  metrics: [],
  seoTitle: "SEO Project Title",
};

let detailResult: ProjectPublicDetail | null | undefined = undefined;

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    return () => detailResult;
  },
  useParams: () => ({ slug: "live-proj" }),
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicProjectBySlug: () => Promise.resolve(detailResult),
}));

describe("ProjectDetail route", () => {
  it("shows not found when API returns null", () => {
    detailResult = null;
    render(() => (
      <MetaProvider>
        <ProjectDetail />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { name: /Project not found/i }),
    ).toBeTruthy();
  });

  it("renders project title when detail loads", () => {
    detailResult = mockDetail;
    render(() => (
      <MetaProvider>
        <ProjectDetail />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { name: "Live Project" })).toBeTruthy();
    expect(screen.getByText("Problem text")).toBeTruthy();
  });
});
