/** Admin-only hint when a nav path targets an unpublished CMS page. */
export function navPathPublishWarning(
  path: string,
  publishedSlugs: ReadonlySet<string>,
): string | null {
  const match = path.match(/^\/pages\/([^/]+)\/?$/);
  if (!match) return null;
  if (!publishedSlugs.has(match[1])) {
    return "This path points to a page that is not published on the public site.";
  }
  return null;
}
