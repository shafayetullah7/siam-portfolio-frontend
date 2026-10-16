import type { PublicSiteNavItem } from "./public-site.types";

/** Show nav links only when the path is in the public sitemap (published content). */
export function filterPublicNav(
  nav: PublicSiteNavItem[],
  sitemapPaths: string[],
): PublicSiteNavItem[] {
  const paths = new Set(sitemapPaths);
  return [...nav]
    .filter((item) => item.visible && paths.has(item.path))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
