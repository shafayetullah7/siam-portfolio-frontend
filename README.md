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

- App: http://localhost:3000
- Vite proxies **`/api`** → `http://localhost:${VITE_API_PROXY_PORT:-5000}`
- **SSR** fetches use `http://localhost:5000/api/v1/...` (not the proxy) — API must be running before loading `/` or `/about`
- Dev-only **API health** line on home (`ApiStatus`) uses client `fetch` to `/api/v1/public/health`

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

`pnpm build` generates a Node app under `.output/` for `pnpm start`. Set `VITE_API_BASE` / `VITE_API_SSR_ORIGIN` at **build** time for production API reachability (no dev proxy).
