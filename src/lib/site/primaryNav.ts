import type { PublicSitePayload } from "~/lib/api/endpoints/public/site.api";
import { HOME_SECTION_LABELS } from "~/components/landing/homeSectionLabels";
import { filterPublicNav } from "./filterPublicNav";

export type PrimaryNavItemKind = "hub" | "focus" | "cms";

export type PrimaryNavItem = {
  label: string;
  href: string;
  matchPath?: string;
  kind: PrimaryNavItemKind;
};

const FOCUS_SECTION_ID = HOME_SECTION_LABELS.currentlyWorkingOn.domId;

export const PUBLIC_HUB_NAV: readonly PrimaryNavItem[] = [
  { label: "Research", href: "/research", matchPath: "/research", kind: "hub" },
  { label: "Publications", href: "/publications", matchPath: "/publications", kind: "hub" },
  { label: "Projects", href: "/projects", matchPath: "/projects", kind: "hub" },
];

export const PUBLIC_FOCUS_NAV: PrimaryNavItem = {
  label: "Focus",
  href: `/#${FOCUS_SECTION_ID}`,
  kind: "focus",
};

const HUB_PATHS = new Set(PUBLIC_HUB_NAV.map((item) => item.href));

export function buildPrimaryNavItems(site: PublicSitePayload | null | undefined): PrimaryNavItem[] {
  const items: PrimaryNavItem[] = [...PUBLIC_HUB_NAV, PUBLIC_FOCUS_NAV];
  const seen = new Set(items.map((i) => i.href));

  if (site) {
    const cms = filterPublicNav(site.nav, site.sitemapPaths).filter(
      (entry) => !HUB_PATHS.has(entry.path),
    );
    for (const entry of cms) {
      if (seen.has(entry.path)) continue;
      seen.add(entry.path);
      items.push({
        label: entry.label,
        href: entry.path,
        matchPath: entry.path,
        kind: "cms",
      });
    }
  }

  return items;
}

export function isPrimaryNavActive(
  pathname: string,
  hash: string,
  item: PrimaryNavItem,
): boolean {
  if (item.kind === "focus") {
    const normalized = hash.startsWith("#") ? hash : hash ? `#${hash}` : "";
    return pathname === "/" && normalized === `#${FOCUS_SECTION_ID}`;
  }
  const match = item.matchPath ?? item.href;
  if (!match || match.startsWith("/#")) {
    return false;
  }
  return pathname === match || pathname.startsWith(`${match}/`);
}

/** Footer uses the same destinations; Focus is omitted to reduce clutter. */
export function buildFooterNavItems(site: PublicSitePayload | null | undefined): PrimaryNavItem[] {
  return buildPrimaryNavItems(site).filter((item) => item.kind !== "focus");
}
