# Public site chrome (F6)

- **`PublicSiteProvider`** loads [`getPublicSite`](../api/queries/public/site.queries.ts) once for header/footer.
- **`filterPublicNav`** — only show items where `path` is in `sitemapPaths` and `visible` is true.
- **`primaryNav`** — Research, Publications, and Projects are always-on hubs; **Writing** appears only when `GET public/site` `sitemapPaths` includes `/writing` (at least one published article). **Achievements** appears only when `sitemapPaths` includes `/achievements` (at least one published P09 entry).

Admin saves → `revalidate(getPublicSite.key)`; contact copy also `revalidate(getPublicContactConfig.key)` from site settings save.

## Contact nav policy (P16 / MSG9)

- Header and mobile **Contact** CTA in [`Nav.tsx`](../../components/Nav.tsx) points to **`/contact`** (canonical form surface).
- About keeps a secondary **`#contact`** section with a link through to `/contact`.
- Owner edits intro, categories, consent, toggles, and channels on **`/admin/site`** (Contact page section). Public `/contact` loads that copy via [`getPublicContactConfig`](../api/queries/public/contact.queries.ts), not the main site payload.
- `GET public/site` `sitemapPaths` includes `/contact` for SEO/sitemap.
