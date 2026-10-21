# Shared UI primitives

## Async routes (F3)

**Public SSR routes** use `query` + `createAsync` in [`lib/api/queries/public/`](../lib/api/queries/public/). Loading and errors use [`AsyncRouteShell`](./AsyncRouteShell.tsx) **inside** [`routes/(public).tsx`](../routes/(public).tsx) `main#main` so Nav/footer stay visible. Root `app.tsx` only has a last-resort `ErrorBoundary` (`variant="standalone"`).

Example route:

```tsx
import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getPublicSite } from "~/lib/api/queries/public";
import LandingPage from "~/components/landing/LandingPage";
import { homeContent } from "~/content";

export const route = {
  preload: () => {
    void getPublicSite();
  },
} satisfies RouteDefinition;

export default function Home() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  return <LandingPage content={homeContent} />;
}
```

Home body is static (`~/content`) until LP7/CMS; `getPublicHome` remains in the API layer for future parity.

After admin mutations, invalidate cached public data:

```ts
import { revalidate } from "@solidjs/router";
import { getPublicSite } from "~/lib/api/queries/public";

revalidate(getPublicSite.key);
// Future public page by slug: revalidate(getPublicPageBySlug.keyFor(slug));
```

**Per-route shell:** `AsyncRouteShell` — used by `(public)` layout and admin `main` (compact `PageLoading`).

### Admin routes (until later phase)

Use `ResourceRequest` + `createResource` so API errors show `HttpErrorNotice` without relying on the boundary:

```tsx
const resource = createResource(() => adminPagesApi.list());
return (
  <ResourceRequest resource={resource}>
    {(data) => <main>...</main>}
  </ResourceRequest>
);
```

### When to use what

| Situation | Use |
|-----------|-----|
| Public SSR fetch via `createAsync` | `(public)` `AsyncRouteShell` → `PageLoading`; throw → `RouteErrorFallback` (`embedded`, no second `main`) |
| `ApiError` 404 from public API | `RouteErrorFallback` → branded not-found (`EmptyState`) |
| Render bugs / dev boundary test | `ErrorBoundary` → `RouteErrorFallback` |
| Admin `createResource` fetch failure | `HttpErrorNotice` via `ResourceRequest` |
| Admin form mutation (F7) | `action` + `useSubmission` → `FormActionResult`; CMS: `mapAdminMutationError`; auth: `getAuthFormErrorMessage` — not `ErrorBoundary` |
| Empty list / no rows | `EmptyState` (`variant="list"` in admin tables) |

See [Handle error and loading states](https://docs.solidjs.com/solid-router/data-fetching/how-to/handle-error-and-loading-states).

## Form fields (F7)

[`components/forms/`](./forms/) — `FormField`, `FormTextInput`, `FormTextarea`, `FormErrorAlert` (token classes `siam-input` / `siam-textarea`). Pair with actions in [`lib/forms/actions/`](../lib/forms/actions/) and schemas in [`lib/forms/schemas/`](../lib/forms/schemas/).

## Public chrome (F6)

Wide inner pages use [`PUBLIC_PAGE_WIDE`](./layout/publicPageWidth.ts) (about, catalog hubs, detail stubs). Public chrome lives in [`routes/(public).tsx`](../routes/(public).tsx): `PublicSiteProvider`, fixed landing-style [`Nav`](./Nav.tsx), single `main#main`, and [`LandingHomeFooter`](./landing/LandingHomeFooter.tsx). [`primaryNav.ts`](../lib/site/primaryNav.ts) builds link lists: **code-owned** hub routes (`/research`, `/publications`, `/projects`), **Focus** (`/#currently-working-on` from home section ids), then CMS items from [`filterPublicNav`](../lib/site/filterPublicNav.ts) (gated by API `sitemapPaths`, deduped against hubs). Header and footers share the same builder; footers omit Focus.

## Manual checklist

| Check | URL / action |
|-------|----------------|
| Public loading | `/`, `/about` — throttle network → `PageLoading` |
| Public API error | Stop API → `RouteErrorFallback` on home |
| Public 404 (when API returns 404) | Boundary shows not-found UI |
| Admin list empty | `/admin/pages` with zero rows |
| Admin media | `/admin/media` — upload, edit alt, delete unused file |
| Admin error | `/admin` with API down → `HttpErrorNotice` |
| Boundary | `/dev/error-boundary-test` → `RouteErrorFallback` |
