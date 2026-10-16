# Static catalog content (research, publications, projects)

Until Phases 10–12 ship public APIs and admin CRUD, the frontend keeps a **single catalog layer** under `src/content/`:

| Module | Types | Route |
|--------|--------|--------|
| `research.catalog.ts` | `ResearchTheme` | `/research`, `/research/:slug` |
| `publications.catalog.ts` | `PublicationRecord` | `/publications`, `/publications/:slug` |
| `projects.catalog.ts` | `ProjectRecord` | `/projects`, `/projects/:slug` |

Helpers live in `catalog.ts` (`list*`, `get*`, `*ToHomeItem`, `listFeatured*ForHome`, `listCatalogSitemapPaths`).

## Home page (P01)

`home.content.ts` builds `researchFocus`, `selectedPublications`, and `featuredProjects` from catalog entries with `featuredOnHome: true`. Bounds (3–6 / 2–4 / 2–3) are enforced in `home.validation.ts` and `validateCatalogFeaturedBounds()`.

## Future CMS / API mapping

Planned public endpoints (names illustrative):

- `GET /public/research-themes` → `ResearchTheme[]`
- `GET /public/publications` → `PublicationRecord[]`
- `GET /public/projects` → `ProjectRecord[]`

`featuredOnHome` should become an admin flag or join table (home editor / A03). The home aggregate can then replace static `featuredOnHome` filtering.

When routes are live in production, extend API `sitemapPaths` and nav seed to include `/research`, `/publications`, `/projects` (see `filterPublicNav`). Hub links are already in the public header via `buildPrimaryNavItems`; redundant CMS nav rows for those paths are ignored by dedupe.

## Stub detail pages

`[slug]` routes are **stubs** (P04/P06/P08 not implemented). Unknown slugs render an in-page not-found UI.
