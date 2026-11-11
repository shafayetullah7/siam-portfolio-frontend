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
  published: true,
  headline: "About me",
  displayName: "Ada Lovelace",
  professionalTitle: "ML researcher",
  shortBio: "Short published bio",
  longBio: null,
  affiliation: null,
  affiliationRole: "Researcher",
  affiliationOrganization: "Example Lab",
  affiliationLocation: null,
  researchStatement: "## Motivation\n\nTrustworthy ML.",
  expertise: {
    domains: ["Interpretable learning"],
    methodologies: [],
    tooling: [],
    practices: [],
  },
  scholarlyProfiles: [{ label: "ORCID", href: "https://orcid.org/0000" }],
  collaborationInterests: "Open to funded collaborations.",
  contactEmail: "ada@example.edu",
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
  it("renders published profile sections and experience from API", () => {
    render(() => (
      <MetaProvider>
        <About />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { level: 1, name: "Ada Lovelace" }),
    ).toBeTruthy();
    expect(screen.getByText("Short published bio")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /Research statement/i }),
    ).toBeTruthy();
    expect(screen.getByText("Interpretable learning")).toBeTruthy();
    expect(screen.getByRole("link", { name: "ORCID" })).toBeTruthy();
    expect(screen.getByText("Open to funded collaborations.")).toBeTruthy();
    expect(
      screen.queryByText(/Content from the CMS will appear here/i),
    ).toBeNull();
    expect(
      screen.getByRole("heading", { name: /Education & experience/i }),
    ).toBeTruthy();
    expect(screen.getByText("Published degree")).toBeTruthy();
  });
});
