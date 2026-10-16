import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import PublicLayout from "./(public)";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: null,
  footerText: null,
  faviconUrl: null,
  nav: [],
  sitemapPaths: ["/"],
};

vi.mock("@solidjs/router", () => ({
  useLocation: () => ({ pathname: "/", hash: "" }),
  createAsync: () => () => mockSite,
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicSite: () => Promise.resolve(mockSite),
}));

describe("PublicLayout", () => {
  it("renders single main landmark with nav and footer", () => {
    render(() => (
      <MetaProvider>
        <PublicLayout
          params={{}}
          location={{ pathname: "/", search: "", hash: "", query: {}, state: {}, key: "test" }}
          data={undefined}
        >
          <p>Page body</p>
        </PublicLayout>
      </MetaProvider>
    ));

    expect(document.querySelectorAll("main#main")).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeTruthy();
    expect(screen.getByText("Page body")).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
