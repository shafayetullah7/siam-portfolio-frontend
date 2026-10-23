import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import AchievementsIndex from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockHub = {
  intro: null,
  sections: [
    {
      kind: "award" as const,
      items: [
        {
          id: "1",
          kind: "award" as const,
          title: "Published award",
          subtitle: null,
          organization: "Org",
          location: null,
          startDate: "2024-01-01",
          endDate: null,
          isOngoing: false,
          featured: false,
          proofUrl: null,
          images: [],
          href: "/achievements/published-award",
        },
      ],
    },
  ],
};

const emptyHub = { intro: null, sections: [] };

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    if (key.includes("featured: true") || key.includes("featured:true")) {
      return () => emptyHub;
    }
    return () => mockHub;
  },
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicAchievements: (params?: { featured?: boolean }) =>
    Promise.resolve(params?.featured ? emptyHub : mockHub),
}));

describe("AchievementsIndex route", () => {
  it("renders section heading and card from API", () => {
    render(() => (
      <MetaProvider>
        <AchievementsIndex />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { level: 1, name: /Achievements/i }),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Award" })).toBeTruthy();
    expect(screen.getByText("Published award")).toBeTruthy();
  });
});
