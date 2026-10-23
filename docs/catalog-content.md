# Static catalog content (research, publications, projects)

Until Phases 10–12 ship public APIs and admin CRUD, the frontend keeps a **single catalog layer** under `src/content/`:

| Module | Types | Route |
|--------|--------|--------|
| `research.catalog.ts` | `ResearchTheme` | **Seed / home only** — public `/research` uses `GET /public/research-themes` |
| `publications.catalog.ts` | `PublicationRecord` | **Seed / validation only** — public `/publications` uses `GET /public/publications` |
| `projects.catalog.ts` | `ProjectRecord` | **Seed / validation only** — public `/projects` uses `GET /public/projects` |

Helpers live in `catalog.ts` (`list*`, `get*`, `*ToHomeItem`, `listFeatured*ForHome`, `listCatalogSitemapPaths`).

## Home page (P01)

`researchFocus` on `/` comes from **`getPublicHome().researchFocus`** (API: published themes with `featuredOnHome`). Static catalog `featuredOnHome` is used only for `validateCatalogFeaturedBounds()` and dev seed alignment.

`selectedPublications` on `/` comes from **`getPublicHome().selectedPublications`** when the API returns published rows with `featuredOnHome` (max 4). Static catalog remains a fallback when the API returns none.

`featuredProjects` on `/` comes from **`getPublicHome().selectedProjects`** when the API returns published rows with `featuredOnHome` (max 3, cover when media alt is set). No static catalog fallback on the home page.

Publication and project detail URLs in `sitemap.xml` come from **`getPublicSite().sitemapPaths`** and public list APIs (not static catalog slugs). Bounds (3–6 / 2–4 / 2–3) are enforced in `home.validation.ts` and `validateCatalogFeaturedBounds()`.

## Future CMS / API mapping

Planned public endpoints (names illustrative):

- `GET /public/research-themes` → `ResearchTheme[]`
- `GET /public/publications` → `PublicationRecord[]`
- `GET /public/projects` → project public cards (`ProjectPublicList`)

`featuredOnHome` should become an admin flag or join table (home editor / A03). The home aggregate can then replace static `featuredOnHome` filtering.

When routes are live in production, extend API `sitemapPaths` and nav seed to include `/research`, `/publications`, `/projects` (see `filterPublicNav`). Hub links are already in the public header via `buildPrimaryNavItems`; redundant CMS nav rows for those paths are ignored by dedupe.

## Public routes

`/publications` and `/publications/[slug]` load from the public publications API. `/projects` and `/projects/[slug]` load from `GET /public/projects` and `GET /public/projects/:slug`.
