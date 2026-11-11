import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { TalkPublicDetail } from "~/lib/api/types/talks.types";
import TalkDetail from "./[slug]";

const mockSite = {
  siteName: "SIAM Lab",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/talks"],
  footerText: "",
};

const mockDetail: TalkPublicDetail = {
  slug: "live-keynote",
  title: "Live Keynote",
  eventName: "Conf",
  startsAt: "2026-06-15T14:30:00.000Z",
  timezone: "UTC",
  role: "speaker",
  talkType: "conference_talk",
  isOnline: true,
  description: "Description.",
  resources: [
    {
      label: "Slides",
      url: "https://example.com/slides.pdf",
      resourceType: "slides",
    },
    {
      label: "Recording",
      url: "https://example.com/video",
      resourceType: "video",
    },
  ],
  related: { publications: [], projects: [], themes: [] },
};

let detailResult: TalkPublicDetail | null | undefined = undefined;

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) {
      return () => mockSite;
    }
    return () => detailResult;
  },
  useParams: () => ({ slug: "live-keynote" }),
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
}));

vi.mock("~/lib/api/queries/public/talks.queries", () => ({
  getPublicTalkBySlug: () => Promise.resolve(detailResult),
}));

describe("TalkDetail route", () => {
  it("shows not found when API returns null", () => {
    detailResult = null;
    render(() => (
      <MetaProvider>
        <TalkDetail />
      </MetaProvider>
    ));
    expect(
      screen.getByRole("heading", { name: /Talk not found/i }),
    ).toBeTruthy();
  });

  it("renders materials as external links without embeds", () => {
    detailResult = mockDetail;
    const { container } = render(() => (
      <MetaProvider>
        <TalkDetail />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { name: "Live Keynote" })).toBeTruthy();
    const slides = screen.getByRole("link", { name: "Slides" });
    expect(slides.getAttribute("href")).toBe("https://example.com/slides.pdf");
    expect(slides.getAttribute("target")).toBe("_blank");
    expect(container.querySelector("iframe")).toBeNull();
  });
});
