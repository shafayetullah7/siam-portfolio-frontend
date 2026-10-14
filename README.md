# siam-frontend

SolidStart app for the public portfolio and `/admin` CMS.

**Start here:** [docs/frontend-developer-guide.md](./docs/frontend-developer-guide.md) — theme, auth, layout.

**API & forms:** [docs/api-convention.md](./docs/api-convention.md) — `publicClient` / `adminClient`, endpoints, Zod for forms only.

| Topic | Doc |
|--------|-----|
| Theme spec | [../docs/design-tokens.md](../docs/design-tokens.md) |
| Tailwind v4 | [docs/tailwind.md](./docs/tailwind.md) |
| Solid / SolidStart | [docs/solid-solidstart.md](./docs/solid-solidstart.md) |

---

## SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Creating a project

```bash
# create a new project in the current directory
npm init solid@latest

# create a new project in my-app
npm init solid@latest my-app
```

## Developing

```bash
pnpm install
cp .env.example .env
# Terminal 1 — API + Postgres (see siam-api/README.md)
# Terminal 2:
pnpm dev
```

Vite proxies `/api` → `http://localhost:5000`. Home page shows API health when the API is running.

## Building

Solid apps are built with Nitro _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app under `.output` that you can run with `npm start`. To use a different preset, set it on the `nitro()` plugin in your `vite.config.ts`.

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
