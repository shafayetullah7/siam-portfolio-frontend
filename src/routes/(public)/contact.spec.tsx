import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ContactPageContent from "~/components/contact/ContactPageContent";
import ContactPage from "./contact";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: "Test",
  nav: [],
  sitemapPaths: ["/"],
  footerText: "",
};

const mockConfigEnabled = {
  formEnabled: true,
  intro: "Say hello",
  collaborationGuidance: null,
  responseTimeNote: null,
  categories: ["Collaboration"],
  consentText: null,
  successMessage: "Thanks!",
  publicEmail: "researcher@example.edu",
  showEmailOnPage: true,
  turnstileSiteKey: null,
};

vi.mock("@solidjs/router", () => ({
  createAsync: (loader: () => unknown) => {
    const key = loader.toString();
    if (key.includes("getPublicSite")) return () => mockSite;
    if (key.includes("getPublicContactConfig")) return () => mockConfigEnabled;
    return () => undefined;
  },
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
  getPublicContactConfig: () => Promise.resolve(mockConfigEnabled),
}));

describe("Contact route", () => {
  it("renders contact heading and form when enabled", () => {
    render(() => (
      <MetaProvider>
        <ContactPage />
      </MetaProvider>
    ));
    expect(screen.getByRole("heading", { name: "Contact" })).toBeTruthy();
    expect(screen.getByText("Say hello")).toBeTruthy();
    expect(screen.getByRole("button", { name: /send message/i })).toBeTruthy();
  });
});

describe("ContactPageContent (form disabled)", () => {
  it("hides submit when form is disabled", () => {
    render(() => (
      <ContactPageContent
        config={{ ...mockConfigEnabled, formEnabled: false }}
      />
    ));
    expect(screen.queryByRole("button", { name: /send message/i })).toBeNull();
    expect(screen.getByText(/not available/i)).toBeTruthy();
  });
});
