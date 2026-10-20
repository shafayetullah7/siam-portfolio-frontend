# siam-frontend

SolidStart app for the public portfolio and `/admin` CMS.

**Start here:** [docs/frontend-developer-guide.md](./docs/frontend-developer-guide.md) — theme, auth, layout.

**Full stack:** [../docs/local-development.md](../docs/local-development.md) — API + Postgres + env.

**Platform phases:** [docs/frontend-setup-phases.md](./docs/frontend-setup-phases.md) (F0 env, F1 404/errors, …).

| Topic | Doc |
|--------|-----|
| API & forms | [docs/api-convention.md](./docs/api-convention.md) |
| Theme spec | [../docs/design-tokens.md](../docs/design-tokens.md) |
| Tailwind v4 | [docs/tailwind.md](./docs/tailwind.md) |
| Solid / SolidStart | [docs/solid-solidstart.md](./docs/solid-solidstart.md) |

## Developing

**Prerequisites:** Node ≥24, pnpm, running [siam-api](../siam-api) on port **5000** (see monorepo [local-development.md](../docs/local-development.md)).

```bash
pnpm install
cp .env.example .env
# Terminal 1: siam-api — docker:db, db:migrate, start:dev
pnpm dev
```

- App: http://localhost:5001
- API: `VITE_API_BASE` (default `http://localhost:5000/api/v1`); set matching `CORS_ORIGIN` on `siam-api`
- API must be running before loading `/` or `/about` (SSR and client fetches use the same base URL)
- Dev-only **API health** line on home (`ApiStatus`) calls the public health endpoint via `publicClient`

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Vite + SolidStart dev server |
| `pnpm build` | Production build (`.output/`) |
| `pnpm start` | Run Nitro server from build |
| `pnpm test` | Vitest (unit + component tests) |
| `pnpm typecheck` | `tsc --noEmit` on `src/` |
| `pnpm test:e2e` | Playwright (requires API + `pnpm start`; see local-development) |
| `pnpm test:e2e:install` | Install Chromium for Playwright |

## Building

`pnpm build` generates a Node app under `.output/` for `pnpm start`. `VITE_*` is baked in at build time — update `.env` and rebuild when changing API or site URLs (see `.env.example`).
