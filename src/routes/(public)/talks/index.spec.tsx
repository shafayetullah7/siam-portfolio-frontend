import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { TalkPublicCard } from "~/lib/api/types/talks.types";
import TalksIndex from "./index";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/talks"],
  footerText: "",
};

const mockCard: TalkPublicCard = {
  slug: "keynote",
  title: "Keynote Talk",
  eventName: "AI Summit",
  startsAt: "2026-06-15T14:30:00.000Z",
  timezone: "UTC",
  role: "speaker",
  talkType: "invited_talk",
  isOnline: false,
  location: "NYC",
  description: "A talk summary.",
};

let hubResult:
  | { intro: string | null; upcoming: TalkPublicCard[]; past: TalkPublicCard[] }
  | undefined = undefined;

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    return () => hubResult;
  },
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
}));

vi.mock("~/lib/api/queries/public/talks.queries", () => ({
  getPublicTalks: () => Promise.resolve(hubResult),
}));

describe("TalksIndex route", () => {
  it("shows not found when hub has no talks", () => {
    hubResult = { intro: null, upcoming: [], past: [] };
    render(() => (
      <MetaProvider>
        <TalksIndex />
      </MetaProvider>
    ));
    expect(screen.getByText(/Page not found/i)).toBeTruthy();
  });

  it("renders upcoming and past sections", () => {
    hubResult = {
      intro: null,
      upcoming: [mockCard],
      past: [{ ...mockCard, slug: "past-talk", title: "Past Talk" }],
    };
    render(() => (
      <MetaProvider>
        <TalksIndex />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { name: "Talks" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Upcoming" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Past" })).toBeTruthy();
    expect(screen.getByText("Keynote Talk")).toBeTruthy();
    expect(screen.getByText("Past Talk")).toBeTruthy();
  });
});
