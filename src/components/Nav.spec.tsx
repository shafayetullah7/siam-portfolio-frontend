import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import Nav from "./Nav";

const mockSite = {
  siteName: "SIAM",
  defaultMetaDescription: null,
  footerText: null,
  faviconUrl: null,
  nav: [{ id: "1", label: "About", path: "/about", sortOrder: 0, visible: true }],
  sitemapPaths: ["/", "/about"],
};

let mockPathname = "/";

vi.mock("@solidjs/router", () => ({
  useLocation: () => ({ pathname: mockPathname, hash: "" }),
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/site/PublicSiteProvider", () => ({
  usePublicSite: () => ({ site: () => mockSite }),
}));

describe("Nav", () => {
  it("renders the same primary labels on home and hub routes", () => {
    mockPathname = "/";
    const { unmount: unmountHome } = render(() => <Nav />);
    const homeLabels = screen.getAllByRole("link").map((el) => el.textContent?.trim());
    unmountHome();

    mockPathname = "/research";
    render(() => <Nav />);
    const researchLabels = screen.getAllByRole("link").map((el) => el.textContent?.trim());

    for (const label of ["Research", "Publications", "Projects", "Focus", "About"]) {
      expect(homeLabels).toContain(label);
      expect(researchLabels).toContain(label);
    }
  });
});
