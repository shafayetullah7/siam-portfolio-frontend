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

  it("includes Contact links to /contact", () => {
    mockPathname = "/";
    render(() => <Nav />);
    const contactLinks = screen
      .getAllByRole("link", { name: "Contact" })
      .map((el) => el.getAttribute("href"));
    expect(contactLinks.length).toBeGreaterThanOrEqual(1);
    expect(contactLinks.every((href) => href === "/contact")).toBe(true);
  });

  it("locks body scroll when mobile menu is open and restores on close and unmount", () => {
    mockPathname = "/";
    document.body.style.overflow = "";

    const { unmount } = render(() => <Nav />);
    const menuButton = screen.getByRole("button", { name: "Menu" });

    menuButton.click();
    expect(document.body.style.overflow).toBe("hidden");

    menuButton.click();
    expect(document.body.style.overflow).toBe("");

    menuButton.click();
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
