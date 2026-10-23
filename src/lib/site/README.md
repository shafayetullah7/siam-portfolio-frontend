# Public site chrome (F6)

- **`PublicSiteProvider`** loads [`getPublicSite`](../api/queries/public/site.queries.ts) once for header/footer.
- **`filterPublicNav`** — only show items where `path` is in `sitemapPaths` and `visible` is true.
- **`primaryNav`** — Research, Publications, and Projects are always-on hubs; **Writing** appears only when `GET public/site` `sitemapPaths` includes `/writing` (at least one published article).

Admin saves → `revalidate(getPublicSite.key)`.
