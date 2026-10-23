# Static catalog content (research, publications, projects)

Until Phases 10–12 ship public APIs and admin CRUD, the frontend keeps a **single catalog layer** under `src/content/`:

| Module | Types | Route |
|--------|--------|--------|
| `research.catalog.ts` | `ResearchTheme` | **Seed / home only** — public `/research` uses `GET /public/research-themes` |
| `publications.catalog.ts` | `PublicationRecord` | **Seed / validation only** — public `/publications` uses `GET /public/publications` |
| `projects.catalog.ts` | `ProjectRecord` | `/projects`, `/projects/:slug` |

Helpers live in `catalog.ts` (`list*`, `get*`, `*ToHomeItem`, `listFeatured*ForHome`, `listCatalogSitemapPaths`).

## Home page (P01)

`researchFocus` on `/` comes from **`getPublicHome().researchFocus`** (API: published themes with `featuredOnHome`). Static catalog `featuredOnHome` is used only for `validateCatalogFeaturedBounds()` and dev seed alignment.

`selectedPublications` on `/` comes from **`getPublicHome().selectedPublications`** when the API returns published rows with `featuredOnHome` (max 4). Static catalog remains a fallback when the API returns none. `featuredProjects` still come from catalog until M7 ships.

Publication detail URLs in `sitemap.xml` come from **`getPublicSite().sitemapPaths`** and `GET /public/publications` (not static catalog slugs). Bounds (3–6 / 2–4 / 2–3) are enforced in `home.validation.ts` and `validateCatalogFeaturedBounds()`.

## Future CMS / API mapping

Planned public endpoints (names illustrative):

- `GET /public/research-themes` → `ResearchTheme[]`
- `GET /public/publications` → `PublicationRecord[]`
- `GET /public/projects` → `ProjectRecord[]`

`featuredOnHome` should become an admin flag or join table (home editor / A03). The home aggregate can then replace static `featuredOnHome` filtering.

When routes are live in production, extend API `sitemapPaths` and nav seed to include `/research`, `/publications`, `/projects` (see `filterPublicNav`). Hub links are already in the public header via `buildPrimaryNavItems`; redundant CMS nav rows for those paths are ignored by dedupe.

## Public routes

`/publications` and `/publications/[slug]` load from the public publications API. Unknown slugs render an in-page not-found UI. `/projects` detail routes remain catalog-backed until M7.
