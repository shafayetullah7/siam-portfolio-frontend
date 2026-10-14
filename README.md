# siam-frontend

SolidStart app for the public portfolio and `/admin` CMS.

**Theme:** [../docs/design-tokens.md](../docs/design-tokens.md) — primitives in `src/styles/tokens.css`, Tailwind utilities in `src/app.css` (`bg-canvas`, `text-primary`, `bg-accent-project`, etc.).

**Tailwind v4:** [docs/tailwind.md](./docs/tailwind.md) — conventions, v3 pitfalls, and what not to do.

**Solid / SolidStart:** [docs/solid-solidstart.md](./docs/solid-solidstart.md) (SIAM guide) · [docs/solid-solidstart-reference.md](./docs/solid-solidstart-reference.md) (extended).

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

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Solid apps are built with Nitro _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app under `.output` that you can run with `npm start`. To use a different preset, set it on the `nitro()` plugin in your `vite.config.ts`.

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
