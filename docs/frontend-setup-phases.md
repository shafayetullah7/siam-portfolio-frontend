# SIAM frontend — setup phases (platform & UX)

Phased plan to bring **`siam-frontend`** to a production-ready platform: routing, errors, data loading, auth UX, and shared UI patterns — **before and alongside** product pages in [portfolio-delivery-phases.md](../../docs/portfolio-delivery-phases.md).

**This doc is implementation guidance.** Patterns below are checked against **official Solid / SolidStart v2 / Solid Router v1** docs (not TanStack Start/Router, not Next.js `error.tsx` / `loading.tsx`).

---

## Stack versions (pin before copying web examples)

| Package | Repo version | Official docs |
|---------|----------------|---------------|
| `solid-js` | ^1.9.14 | [Solid](https://docs.solidjs.com/) |
| `@solidjs/start` | ^2.0.0 | [SolidStart v2](https://docs.solidjs.com/solid-start/v2) |
| `@solidjs/router` | ^1.0.0 | [Solid Router](https://docs.solidjs.com/solid-router/) |
| `@solidjs/meta` | ^0.29.4 | [Meta](https://github.com/solidjs/solid-meta) |
| `vite` | ^8.x | [Vite](https://vite.dev/) |
| `nitro` | ^3.0.x (via Start) | Bundled with Start 2 output (`.output/`) |
| Node | >=24 (`package.json`) | Match CI/local |

**Router rule:** Use `@solidjs/router` **`query`**, **`createAsync`**, **`action`**, **`FileRoutes`** only. Do **not** use TanStack Router/Start error APIs or Next-style route segments.

**Internal guides:** [solid-solidstart.md](./solid-solidstart.md), [api-convention.md](./api-convention.md), [frontend-developer-guide.md](./frontend-developer-guide.md).

---

## Current baseline (gap summary)

| Area | State |
|------|--------|
| `FileRoutes` + `app.tsx` global `Suspense` | Present |
| Catch-all 404 | `[...404].tsx` exists — **starter boilerplate**, not SIAM-themed |
| `ErrorBoundary` | **Not used** at app or route level |
| Route data | Mix of **`createResource`** (e.g. home) vs doc standard **`query` + `createAsync`** |
| HTTP errors | `ApiError` in clients; **no shared UI** mapping 400/403/404/429 |
| Admin auth | `AdminAuthProvider` + `useAdminAuth`; `adminSession` bridge for `forceLogout` |
| Forms / Zod | `lib/forms` — Zod 4 schemas, `action` + `useSubmission`, shared field components |
| Tests / CI | Vitest + Playwright e2e; `pnpm typecheck`; CI e2e with Postgres + API |
| Public layout | API-driven `Nav` / footer via `PublicSiteProvider` + `getPublicSite` |
| Product routes P03–P18 | Mostly **not started** (see portfolio phases) |

---

## How to do each platform concern (version-correct)

### 404 / unmatched URLs

- **SolidStart v2:** Add `src/routes/[...404].tsx` with a default export; filesystem maps to catch-all `/*404`. See [Routing — dynamic segments](https://docs.solidjs.com/solid-start/v2/building-your-application/routing).
- **Do not** rely on TanStack `errorComponent` for 404.
- **API 404** (e.g. unknown published slug): handle in route/query (map `ApiError` status 404 → in-page not-found UI **without** revealing drafts).

### Error boundaries (render / async data failures)

- Use Solid’s **`ErrorBoundary`** from `solid-js`. Catches errors during **render/update** of children; **not** event handlers or `setTimeout`. Fallback may be `(error, reset) => …` to call `reset()`. See [Error boundary](https://docs.solidjs.com/concepts/control-flow/error-boundary).
- **`createAsync` / `query`:** Errors propagate to the **nearest** `ErrorBoundary`; pending state goes to **nearest** `Suspense`. See [Handle pending and error states](https://docs.solidjs.com/solid-router/data-fetching/how-to/handle-error-and-loading-states) and [SolidStart data fetching — handling errors](https://docs.solidjs.com/solid-start/v2/guides/data-fetching).
- **Mutations:** Use `action` + **`useSubmission(action).error`** (and optional `result` for field errors). See [Data mutation](https://docs.solidjs.com/solid-start/v2/guides/data-mutation).

### Loading / SSR streaming

- Wrap async UI in **`Suspense`** with token-aligned fallbacks (skeletons).
- **`createAsync(..., { deferStream: true })`** when the server must **wait** for data before sending initial HTML (e.g. critical `<Title>` / hero). See [Streaming — deferStream](https://docs.solidjs.com/solid-router/data-fetching/streaming).
- Default: streaming is fine for non-critical sections (dashboard widgets, related lists).

### Data fetching (replace ad-hoc `createResource` on SSR routes)

1. Define **`query(fetcher, "uniqueName")`** — often in `lib/api/queries/` or next to route, calling **`publicClient` / `adminClient`** (never raw `fetch` in components).
2. In route: **`createAsync(() => getX(...))`** with reactive reads inside the arrow (params, searchParams).
3. Optional: **`export const route = { preload: … } satisfies RouteDefinition`** to warm cache on navigation. See [Data fetching](https://docs.solidjs.com/solid-start/v2/building-your-application/data-fetching).
4. Server-only cookie/session: **`"use server"`** inside query + `@solidjs/start/http` when needed (admin SSR reads). See same doc — `useSession` example pattern.
5. **API base URL:** `VITE_API_BASE` is a full `http(s)://…/api/v1` for browser and SSR; API `CORS_ORIGIN` matches the app. See [api-convention.md §11](./api-convention.md).

### Meta / SEO

- Keep using **`@solidjs/meta`** (`Title`, `Meta`) + `buildPageMeta()` per route.
- Align with portfolio Phase 6 (canonical, OG when API fields exist).

### Auth / cookies (admin)

- Browser: `credentials: 'include'`, `X-XSRF-TOKEN` on mutating `adminClient` calls — already in [api-convention.md](./api-convention.md).
- Implement guide §5–6: session store, **`AdminAuthProvider`**, `forceLogout` on 401 after refresh fail, login `reason` query param.
- Optional server queries: forward `Cookie` header in `"use server"` fetch to API when admin pages SSR.

---

## Phase F0 — Environment & dev ergonomics

**Objective:** Local and SSR fetches work reliably; no `ERR_INVALID_URL` on server.

**Tasks**

- Document and use `.env` from [`.env.example`](../.env.example): `VITE_API_BASE`, `VITE_SITE_ORIGIN`; API `CORS_ORIGIN` aligned with app URL.
- Nest running for SSR pages that hit API on first paint.

**Runbook:** [../../docs/local-development.md](../../docs/local-development.md)

**Exit criteria**

- [x] `pnpm dev`: home/about SSR without URL parse errors when API is up (see [local-development.md](../../docs/local-development.md) — verify with API running).
- [x] `pnpm build` + `pnpm start` smoke-tested once (2026-10-16).

**References:** [frontend-developer-guide.md §1](./frontend-developer-guide.md), [api-convention.md §11](./api-convention.md).

---

## Phase F1 — App shell, layouts, and 404

**Objective:** Consistent public/admin chrome and branded not-found.

**Tasks**

1. **Public layout** — Optional `routes/(public).tsx` or shared wrapper: `main#main`, footer placeholder, hide `Nav` on admin (today: `app.tsx` + `admin.tsx`).
2. **404** — Rewrite [`src/routes/[...404].tsx`](../src/routes/[...404].tsx): SIAM tokens, link home, optional “contact”; remove Solid starter links.
3. **Root boundaries** — In `app.tsx`: wrap `props.children` in **`ErrorBoundary`** (app-wide fallback + `reset`) **outside** or **inside** `Suspense` per desired behavior (boundary catches render errors from async children once resolved).
4. **Dev-only routes** — Gate `design-preview`, strip or hide `ApiStatus` on production home.

**Exit criteria**

- [x] Unknown path shows SIAM 404.
- [x] Throw in a test route is caught by boundary without white screen (`/dev/error-boundary-test`, DEV only).
- [x] Admin routes do not show public `Nav` or public footer.

**References:** [SolidStart routing](https://docs.solidjs.com/solid-start/v2/building-your-application/routing), [Error boundary](https://docs.solidjs.com/concepts/control-flow/error-boundary).

---

## Phase F2 — Shared async UX primitives

**Objective:** One pattern for loading, error, and empty states.

**Tasks**

1. **Components** (presentational, under `src/components/`):
   - `PageLoading` / route skeleton
   - `RouteErrorFallback` (props: `error`, `reset`, optional `status`)
   - `HttpErrorNotice` (maps `ApiError` → copy for 403, 404, 429)
   - Extend `EmptyState` for list pages
2. **Pattern doc** in code comments or short README in `components/`:
   ```tsx
   <ErrorBoundary fallback={(err, reset) => <RouteErrorFallback error={err} reset={reset} />}>
     <Suspense fallback={<PageLoading />}>
       {/* createAsync-driven UI */}
     </Suspense>
   </ErrorBoundary>
   ```
3. **Event handlers** — Form submit errors: `try/catch` + `ApiError`; not `ErrorBoundary`.

**Exit criteria**

- [x] Home and About use shared fallbacks (`ResourceRequest` + `PageLoading` / `HttpErrorNotice`; F3 swaps to `createAsync` + boundary-thrown errors).
- [x] Manual checklist for loading / error / empty — see [`src/components/README.md`](../src/components/README.md).

**References:** [Handle error and loading states](https://docs.solidjs.com/solid-router/data-fetching/how-to/handle-error-and-loading-states).

---

## Phase F3 — Data layer standardization (`query` / `createAsync`)

**Objective:** All SSR-capable public (and later admin) routes use Router queries, not scattered `createResource`.

**Tasks**

1. Add `lib/api/queries/public/` (and `admin/` later): wrap `sitePublicApi`, `pagesPublicApi`, etc. in **`query(..., "name")`**.
2. Migrate [`routes/index.tsx`](../src/routes/index.tsx), [`about.tsx`](../src/routes/about.tsx), dynamic page routes to **`createAsync` + `route.preload`** where useful.
3. **404 mapping:** In query or route, if `ApiError.status === 404`, throw or return sentinel consumed by route-specific not-found UI (do not leak draft).
4. Choose **`deferStream: true`** for routes where `<Title>` / meta depend on fetched data.
5. **Invalidate** after admin mutations (Router cache / re-call query — follow [Queries](https://docs.solidjs.com/solid-router/data-fetching/queries) when adding writes).

**Exit criteria**

- [x] No `createResource` for public SSR route data (Home, About use `query` + `createAsync`; admin still uses `ResourceRequest`).
- [x] Thin routes: wire meta + layout + `createAsync` + `route.preload` only.

**References:** [Data fetching (Start v2)](https://docs.solidjs.com/solid-start/v2/building-your-application/data-fetching), [createAsync](https://docs.solidjs.com/solid-router/reference/data-apis/create-async), [solid-solidstart.md §6](./solid-solidstart.md).

---

## Phase F4 — HTTP error policy & `ApiError` UX

**Objective:** Implement [frontend-developer-guide.md §6](./frontend-developer-guide.md) in UI.

**Tasks**

| Status | Behavior |
|--------|----------|
| 401 | `adminClient` only: refresh → `forceLogout` (done); ensure login shows `reason=session_expired` |
| 403 | Toast/inline message; **no** auto logout |
| 400 | Map `validationErrors` to form fields |
| 404 | Public: not-found component; Admin: empty or “missing” |
| 429 | Login/register throttle messaging |

- Central **`getApiErrorMessage(error: unknown)`** in `lib/api/` (optional helper).
- **`publicClient`:** never triggers admin logout.

**Exit criteria**

- [x] Login displays messages for 400 vs 429 vs generic failure (`getAuthFormErrorMessage`).
- [x] Documented matrix in guide matches implementation (§6.5).

---

## Phase F5 — Admin auth UX (portfolio Phase 5 frontend)

**Objective:** Match [admin-auth.md](../../siam-api/docs/admin-auth.md) and guide §5–6.

**Remaining work (registration resend, MFA, e2e, shared auth UI):** [admin-auth-delivery-phases.md](../../docs/admin-auth-delivery-phases.md)

**Tasks**

1. **`AdminAuthProvider`** + `useAdminAuth()` wrapping `/admin` layout (not public site).
2. Guard: **`unknown` → loading shell**; **`anonymous` → login** with `returnUrl`; no flash of protected content.
3. Pages: login (existing), **register**, **verify OTP**, **registration-status**, **forgot/reset password**, **change password** (as API ships).
4. Admin header: **logout**, user label.
5. Add **`zod`** to frontend; schemas in `lib/forms/schemas/` for auth forms only (validate before POST).

**Exit criteria**

- [x] Portfolio Phase 5 frontend checkboxes in [portfolio-delivery-phases.md](../../docs/portfolio-delivery-phases.md) satisfied (provider, auth routes; MFA/API e2e remain API-owned).
- [x] CSRF + cookies on all admin mutations verified manually (existing `adminClient`; re-check page save after guard).

**References:** [api-convention.md](./api-convention.md), [Data mutation](https://docs.solidjs.com/solid-start/v2/guides/data-mutation) for form `action`s where appropriate.

---

## Phase F6 — API-driven chrome & metadata (portfolio Phase 6)

**Objective:** Nav/footer/settings from API; global meta defaults.

**Tasks**

1. `query` for `GET /public/site`; drive **`Nav`**, footer, mobile menu.
2. Hide nav items when targets have no public content (API + UI rules).
3. Admin site settings screens wired to `adminClient` (settings, nav CRUD).
4. `robots.txt` / `sitemap.xml` routes expanded as routes grow.

**Exit criteria**

- [x] Portfolio Phase 6 frontend exit criteria met (settings + nav admin; profile/homepage admin deferred).
- [x] No hard-coded primary nav only Home/About in production (`filterPublicNav` + API nav).

---

## Phase F7 — Forms, actions, and admin editors

**Objective:** Reusable form stack for CMS and contact.

**Tasks**

1. **`lib/forms/schemas/*`** (Zod 4 — align major with API when added).
2. Prefer **`action` + `useSubmission`** for admin forms that post via Start; or controlled submit + `adminClient` with shared error mapper (CHOICE — document one default).
3. **Unsaved changes:** `beforeunload` pattern extended from site page editor to other editors.
4. Field components: `siam-input`, labels, `aria-invalid`, error text.

**Exit criteria**

- [x] At least two admin forms use Zod + API error mapping (`/admin/site`, `/admin/pages/[id]` actions).
- [x] Contact form (when built) follows same pattern (`contact-inquiry.schema` + `lib/forms/README`).

---

## Phase F8 — Testing, CI, and production hardening

**Objective:** Regressions caught; safe deploy.

**Tasks**

1. **Unit:** `RouteErrorFallback`, `getApiErrorMessage`, `apiBaseUrl()` SSR vs client.
2. **E2e (Playwright or similar):** 404 page, home SSR, admin login, guarded redirect.
3. **CI:** add frontend e2e job when stable.
4. **Production:** `VITE_API_BASE` full origin if cross-host; security headers via Nitro config as needed.
5. Remove/gate debug UI.

**Exit criteria**

- [x] CI runs typecheck + build + test + targeted e2e (`siam-frontend` + `siam-frontend-e2e` jobs).
- [x] Production env documented in `.env.example`.

---

## Product work (after platform F1–F4 minimum)

Implement remaining **portfolio phases** on top of this platform — each with F2/F3 patterns:

| Portfolio phase | Frontend focus |
|-----------------|----------------|
| 7 Media | Upload UI, library, picker, alt text |
| 8 Dashboard | Admin home widgets, empty onboarding |
| 9 Home/About | P01/P02/A03 editors + preview |
| 10+ Publications, projects, writing, contact, search, … | List/detail routes, filters in URL, meta, empty states |

Track detail in [portfolio-delivery-phases.md](../../docs/portfolio-delivery-phases.md); do not duplicate full P01–P18 scope here.

---

## Suggested execution order

```text
F0 → F1 → F2 → F3 (public routes first)
     ↘ F4 in parallel with F3
F5 (auth) after F1–F2
F6 after F3 + partial API
F7 with each new admin feature
F8 continuous; e2e after F1+F5
```

**Minimum “platform ready” for new feature routes:** **F0 + F1 + F2 + F3 + F4**.

---

## Anti-patterns (do not implement)

| Source | Why invalid for SIAM |
|--------|----------------------|
| Next.js `error.tsx`, `loading.tsx`, `not-found.tsx` | Wrong framework |
| TanStack Start `defaultErrorComponent` | Wrong router stack |
| `useEffect` + `fetch` for route SSR data | Use `query` + `createAsync` |
| Module-level admin session on server | SSR request leakage |
| Zod on API JSON responses | [api-convention.md](./api-convention.md) |
| Client-side Cloudinary upload | [media.md](../../siam-api/docs/media.md) |

---

## Doc changelog

| Date | Change |
|------|--------|
| 2026-10-16 | Initial phased plan; patterns verified against SolidStart v2 / Router v1 docs |
| 2026-10-16 | **F0 done:** [local-development.md](../../docs/local-development.md), Vitest `resolveApiBaseUrl`, CI `pnpm test` |
| 2026-10-16 | **F1 done:** AppErrorFallback, PublicShell/footer, branded 404, dev gates |
| 2026-10-16 | **F2 done:** `lib/api/errors`, PageLoading, RouteErrorFallback, HttpErrorNotice, ResourceRequest, route wiring, `components/README.md` |
| 2026-10-16 | **F3 done:** `lib/api/queries/public`, Home/About `createAsync` + `deferStream`, 404 boundary UX, admin save `revalidate` |
| 2026-10-16 | **F4 done:** `getApiValidationErrors`, `getAuthFormErrorMessage`, login + page editor HTTP UX, guide §6.5 |
| 2026-10-16 | **F5 done:** `AdminAuthProvider`, auth routes + Zod schemas, admin header logout; MFA UI deferred |
| 2026-10-16 | **F6 done:** `PublicSiteProvider`, API Nav/footer, `/admin/site`, `robots.txt` sitemap line |
| 2026-10-16 | **F7 done:** Form actions, field components, page/site editors, login exemplar, `useUnsavedChanges` |
| 2026-10-16 | **F8 done:** Playwright e2e, `typecheck`, Nitro security headers, RouteErrorFallback tests |
