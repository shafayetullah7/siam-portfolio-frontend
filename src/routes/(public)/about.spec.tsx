import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import About from "./about";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockAbout = {
  headline: "About me",
  shortBio: "Short",
  longBio: "Long bio",
  affiliation: null,
};

const mockExperience = {
  intro: null,
  sections: [
    {
      kind: "education" as const,
      items: [
        {
          id: "1",
          kind: "education" as const,
          title: "Published degree",
          subtitle: null,
          organization: "University",
          location: null,
          startDate: "2018-01-01",
          endDate: "2022-01-01",
          isOngoing: false,
          featured: false,
          proofUrl: null,
          images: [],
        },
      ],
    },
  ],
};

const emptyExperience = { intro: null, sections: [] };

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) return () => mockSite;
    if (key.includes("getPublicAbout")) return () => mockAbout;
    if (key.includes("sortOrderAsc") || key.includes("getPublicExperience")) {
      return () => mockExperience;
    }
    return () => emptyExperience;
  },
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicAbout: () => Promise.resolve(mockAbout),
  getPublicExperience: () => Promise.resolve(mockExperience),
}));

describe("About route", () => {
  it("renders experience section heading and entry from API", () => {
    render(() => (
      <MetaProvider>
        <About />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { name: /Education & experience/i }),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Education" })).toBeTruthy();
    expect(screen.getByText("Published degree")).toBeTruthy();
  });
});
