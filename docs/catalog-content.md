# Static catalog content (research, publications, projects)

Until Phases 10–12 ship public APIs and admin CRUD, the frontend keeps a **single catalog layer** under `src/content/`:

| Module | Types | Route |
|--------|--------|--------|
| `research.catalog.ts` | `ResearchTheme` | **Seed / home only** — public `/research` uses `GET /public/research-themes` |
| `publications.catalog.ts` | `PublicationRecord` | **Seed / validation only** — public `/publications` uses `GET /public/publications` |
| `projects.catalog.ts` | `ProjectRecord` | **Seed / validation only** — public `/projects` uses `GET /public/projects` |

Writing has **no** static frontend catalog. Public `/writing` and `/writing/[slug]` use `GET /public/writing` APIs. Dev article rows come from `siam-api/src/db/seed/writing.catalog.ts` only.

Helpers live in `catalog.ts` (`list*`, `get*`, `*ToHomeItem`, `listFeatured*ForHome`, `listCatalogSitemapPaths`).

## Home page (P01)

When the homepage is **published**, `/` body sections come only from **`getPublicHome()`** via `mapPublicHomeToContent` (no static `homeContent` merge). Static catalog `featuredOnHome` flags remain for `validateCatalogFeaturedBounds()` and dev seed alignment—not for rendering a published home.

When the homepage is **unpublished**, `/` still uses placeholder **`homeContent`** until the CMS aggregate is published.

Publication, project, and writing detail URLs in `sitemap.xml` come from **`getPublicSite().sitemapPaths`** and public list API fallbacks (`publicationsPublicApi`, `projectsPublicApi`, `writingPublicApi`) — not static catalog slugs.

**Featured-on-home limits:** Max flags match [`FEATURED_ON_HOME_CAPS`](../src/lib/home/featured-on-home-caps.ts) (6 / 4 / 3), kept in sync with the API. P01 minimum counts (3 / 2 / 2 when any flags are set) are enforced in `validateCatalogFeaturedBounds()` and `home.validation.ts`. Catalog flags are for seed/validation only—not used on a published `/`.

## Future CMS / API mapping

Planned public endpoints (names illustrative):

- `GET /public/research-themes` → `ResearchTheme[]`
- `GET /public/publications` → `PublicationRecord[]`
- `GET /public/projects` → project public cards (`ProjectPublicList`)

`featuredOnHome` should become an admin flag or join table (home editor / A03). The home aggregate can then replace static `featuredOnHome` filtering.

When routes are live in production, extend API `sitemapPaths` and nav seed to include `/research`, `/publications`, `/projects` (see `filterPublicNav`). Hub links are already in the public header via `buildPrimaryNavItems`; redundant CMS nav rows for those paths are ignored by dedupe.

## Public routes

`/publications` and `/publications/[slug]` load from the public publications API. `/projects` and `/projects/[slug]` load from `GET /public/projects` and `GET /public/projects/:slug`.
