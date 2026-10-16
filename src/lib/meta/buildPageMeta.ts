export interface PageMetaInput {
  title: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  body?: string;
}

export interface SiteMetaDefaults {
  siteName: string;
  defaultMetaDescription?: string | null;
}

export function buildPageMeta(
  page: PageMetaInput,
  site: SiteMetaDefaults,
) {
  const title = page.seoTitle?.trim() || page.title;
  const fullTitle = title.includes(site.siteName)
    ? title
    : `${title} | ${site.siteName}`;
  const description =
    page.seoDescription?.trim() ||
    site.defaultMetaDescription?.trim() ||
    (page.body ? page.body.slice(0, 160) : site.siteName);
  return {
    title: fullTitle,
    description,
    ogTitle: title,
    ogDescription: description,
  };
}
