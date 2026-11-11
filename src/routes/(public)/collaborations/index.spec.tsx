import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { CollaborationsPagePublic } from "~/lib/api/types/talks.types";
import CollaborationsIndex from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/collaborations"],
  footerText: "",
};

let pageResult: CollaborationsPagePublic | undefined = undefined;

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    return () => pageResult;
  },
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicCollaborationsPage: () => Promise.resolve(pageResult),
}));

describe("CollaborationsIndex route", () => {
  it("shows not found when page is disabled", () => {
    pageResult = {
      pageEnabled: false,
      intro: null,
      collaborations: [],
      service: [],
    };
    render(() => (
      <MetaProvider>
        <CollaborationsIndex />
      </MetaProvider>
    ));
    expect(screen.getByText(/Page not found/i)).toBeTruthy();
  });

  it("renders sections and contact CTA when enabled", () => {
    pageResult = {
      pageEnabled: true,
      intro: "Intro copy",
      collaborations: [
        {
          partnerName: "Partner Co",
          summary: "We worked together.",
          logo: null,
        },
      ],
      service: [
        {
          serviceType: "reviewing",
          organization: "Journal",
          roleTitle: "Reviewer",
        },
      ],
    };
    render(() => (
      <MetaProvider>
        <CollaborationsIndex />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { level: 1, name: "Collaborations" }),
    ).toBeTruthy();
    expect(screen.getByText("Partner Co")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Academic service" })).toBeTruthy();
    expect(screen.getByText("Journal")).toBeTruthy();
    const contact = screen.getByRole("link", { name: /Get in touch/i });
    expect(contact.getAttribute("href")).toBe("/contact");
  });
});
