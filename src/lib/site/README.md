# Public site chrome (F6)

- **`PublicSiteProvider`** loads [`getPublicSite`](../api/queries/public/site.queries.ts) once for header/footer.
- **`filterPublicNav`** — only show items where `path` is in `sitemapPaths` and `visible` is true.

Admin saves → `revalidate(getPublicSite.key)`.
