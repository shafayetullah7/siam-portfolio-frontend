# SIAM frontend — developer guide

Single entry point for building **`siam-frontend`**: structure, **theme**, **API integration**, **admin auth**, errors, and how this fits **SolidStart 2**.

| Deep dives (keep open alongside this doc) |
|-------------------------------------------|
| [design-tokens.md](../../docs/design-tokens.md) — palette, type, icons spec |
| [tailwind.md](./tailwind.md) — Tailwind v4, tokens wiring |
| [solid-solidstart.md](./solid-solidstart.md) — reactivity, `query` / `createAsync`, no React |
| [admin-auth.md](../../siam-api/docs/admin-auth.md) — cookie JWT, CSRF, API endpoints |
| [architecture.md](../../siam-api/docs/architecture.md) — `/api/v1/public` vs `/admin` |
| **[api-convention.md](./api-convention.md)** — **publicClient / adminClient**, endpoints, Zod forms-only |
| **[frontend-setup-phases.md](./frontend-setup-phases.md)** — **phased platform plan** (404, boundaries, query/SSR, auth UX) |
| **[../../docs/local-development.md](../../docs/local-development.md)** — **two-terminal dev**, ports, SSR vs proxy |

---

## 1. Stack & URLs

| Piece | Choice |
|--------|--------|
| UI | SolidJS 1.9 + SolidStart 2 + `@solidjs/router` |
| Styles | Tailwind v4 + SIAM tokens (`src/styles/tokens.css`, `src/app.css`) |
| Public site | Routes under `src/routes/` (not `/admin`) |
| CMS | Routes under `src/routes/admin/` (or `admin.tsx` layout group per Start file routing) |
| API | `siam-api` — **`/api/v1/public/*`**, **`/api/v1/admin/*`** |
| Auth | HttpOnly cookies + readable `xsrf-token`; no JWT in `localStorage` |

**Base URL (browser):**

- **Preferred dev:** Vite proxy so the browser calls same origin — e.g. `/api/v1/...` → Nest (cookies + CSRF simpler).
- **Cross-origin:** `VITE_API_ORIGIN` + CORS `credentials: true` on API ([project-decisions.md](../../docs/project-decisions.md)).

Env (convention):

```bash
# .env.example (frontend)
VITE_API_BASE=/api/v1          # proxied path, or full origin in prod
```

---

## 2. Source layout (clean code)

```
src/
  app.tsx                 # Router + FileRoutes + global Suspense
  app.css                 # Tailwind + @theme + .siam-* components
  entry-client.tsx
  entry-server.tsx

  routes/                 # File-based pages (public + admin)
  components/             # Shared UI (Nav, cards, forms) — mostly presentational
  icons/                  # One SVG component per file; barrel index.ts
  lib/
    api/                  # publicClient, adminClient, endpoints (see §4, api-convention.md)
    forms/schemas/        # Zod — form validation only (not API responses)
    auth/                 # Admin session store, forceLogout, guards (see §5–§6)
    utils/                # Pure helpers (format dates, slug, parse cookie)
  styles/
    tokens.css            # --siam-* primitives only
```

**Rules:**

| Rule | Detail |
|------|--------|
| **Thin routes** | Route files wire `query` / layout / meta; avoid 200-line pages. |
| **Presentational components** | Receive data via props; no hidden `fetch` inside dumb UI. |
| **One HTTP layer** | All `fetch` goes through `lib/api` — never scatter `fetch('/api/...')` in components. |
| **API types** | TypeScript interfaces in `lib/api/types` — **no Zod** on responses ([api-convention.md](./api-convention.md)). |
| **Forms** | Zod in `lib/forms/schemas` only — validate before calling endpoints. |
| **Barrels** | `~/icons` only; avoid deep imports that bypass barrels. |
| **No React** | See [solid-solidstart.md](./solid-solidstart.md). |

**Admin vs public:**

- Public: `publicClient` only; **never** triggers admin logout on 401.
- Admin: `adminClient` only under `/admin` and auth flows.

---

## 3. Using the theme

Spec: [design-tokens.md](../../docs/design-tokens.md). Wiring: [tailwind.md](./tailwind.md).

### 3.1 Global setup

`app.tsx` imports `./app.css` once. Body defaults: `bg-canvas`, `text-ink`, `font-sans`.

### 3.2 Tailwind semantic classes (preferred)

Use **token utilities**, not random palette grays/blues:

| Use | Classes |
|-----|---------|
| Page background | `bg-canvas` |
| Cards, inputs | `bg-surface`, `border border-border` |
| Headings / body | `text-ink`, `text-ink-muted`, `text-ink-subtle` |
| Primary CTA | `siam-btn-primary` or `bg-primary text-primary-foreground` |
| Secondary CTA | `siam-btn-secondary` |
| Links | `text-link hover:text-link-hover` |
| Section labels | `siam-label` |
| Research / project / writing card header | `bg-accent-research`, `bg-accent-project`, `bg-accent-writing` |

### 3.3 Layout helpers (`app.css`)

```tsx
<main class="siam-container py-12">…</main>
<article class="siam-prose">…long text…</article>
<div class="siam-card siam-card-interactive">…</div>
```

### 3.4 Icons

```tsx
import { SomeIcon } from "~/icons";
<button type="button" class="siam-btn-primary">
  <SomeIcon class="size-4 shrink-0" aria-hidden="true" />
  Save
</button>
```

### 3.5 Admin UI

Same tokens; more `bg-surface` + tables with `border-border`; accents only for status chips. No peach/mint full-page backgrounds in CMS lists.

### 3.6 Adding a new color

1. `--siam-*` in `src/styles/tokens.css`  
2. Map in `app.css` `@theme inline`  
3. Document in `docs/design-tokens.md`

---

## 4. API integration

**Full convention:** [api-convention.md](./api-convention.md) (dual clients, endpoints, refresh-then-logout, forms).

### 4.1 Summary

| Client | Prefix | Credentials | 401 |
|--------|--------|-------------|-----|
| **`publicClient`** | `/public` | `omit` | Throw `ApiError` only — **no** logout |
| **`adminClient`** | `/admin` | `include` + CSRF on writes | `POST /auth/refresh` once → retry → else `forceLogout()` |

- **Paths:** `publicClient.get('/publications')` → `/api/v1/public/publications`.
- **Wrappers:** `lib/api/endpoints/{public,admin}/*.api.ts` — only place with path strings.
- **Queries:** `query` + `"use server"` calls **endpoints**, not UI → `fetch`.
- **Responses:** TypeScript types + optional `unwrap` of `{ success, data }` — **no Zod** on API JSON.
- **Forms:** Zod in `lib/forms/schemas` → `safeParse` → then `adminAuthApi.login(...)` etc.

Stubs: `lib/api/types`, `lib/api/config.ts`; implement `public-client.ts` / `admin-client.ts` per api-convention.

### 4.2 Solid data layer

| Surface | Pattern |
|---------|---------|
| Public SSR | `query` → `endpoints/public/*` → `publicClient` ([solid-solidstart.md §6](./solid-solidstart.md)) |
| Admin | `query` → `endpoints/admin/*` → `adminClient` |
| Filters | `useSearchParams` + reactive `createAsync` ([§6b](./solid-solidstart.md)) |
| After writes | `revalidate` / `query.keyFor` |

### 4.3 Uploads (admin)

`FormData` field `file` → `adminClient.post('/media/upload', formData)` — [media.md](../../siam-api/docs/media.md).

---

## 5. Admin auth state

Session lives in **cookies**, not in frontend memory as source of truth. UI state is a **cache** of `GET /admin/auth/check`.

### 5.1 Endpoints (auth flows)

| Action | Call |
|--------|------|
| Bootstrap session | `GET /admin/auth/check` → `{ admin }` or 401 |
| Login | `POST /admin/auth/login` → sets cookies + body profile |
| Logout | `POST /admin/auth/logout` → revokes session, clears cookies |
| Refresh | `POST /admin/auth/refresh` (usually API guard; optional explicit call) |

Login/register/reset pages use `adminClient` **without** requiring prior session; protected admin routes require session.

### 5.2 Auth store (`src/lib/auth/admin-session.ts`)

Use **Solid context** + signals or `createStore` (client-only):

```ts
type AdminAuthStatus = "unknown" | "authenticated" | "anonymous";

type AdminAuthState = {
  status: AdminAuthStatus;
  admin: AdminProfile | null;
};
```

| Method | Behavior |
|--------|----------|
| `bootstrap()` | Call `check`; set `authenticated` + `admin` or `anonymous` |
| `setFromLogin(admin)` | After successful login (cookies already set) |
| `clear()` | Set `anonymous`, `admin: null` (immediate UI) |

**Do not** store passwords or tokens in signals. **Do not** keep admin profile in a server module singleton.

### 5.3 `AdminAuthProvider`

- Wrap **`/admin` layout** only (not public site).
- On mount: `bootstrap()`.
- Expose: `useAdminAuth()` → `{ status, admin, bootstrap, clear }`.

### 5.4 Route guards (client)

In admin layout (or per-route):

1. While `status === 'unknown'` → show loading shell (avoid flash of login).
2. If `status === 'anonymous'` and route is not login/register/reset → `navigate('/admin/login?returnUrl=…')`.
3. If `authenticated` → render `<Outlet />` / children.

Optional: mirror guard on **server** `"use server"` actions by checking session — UI guard is not security.

### 5.5 Login / logout UX

**Login success:** `setFromLogin(admin)` → `navigate(returnUrl || '/admin')`.

**Logout (user button):** `POST logout` → `clear()` → `navigate('/admin/login')`.

**Forced logout (§6):** `clear()` first → best-effort `logout` → `navigate('/admin/login?reason=session_expired')`.

---

## 6. Unauthorized & error policy

### 6.1 Status codes

| HTTP | Typical cause | Frontend |
|------|----------------|----------|
| **401** | Missing/expired session; refresh failed; revoked session | **`adminClient`:** try `POST /auth/refresh` once, retry request; then **`forceLogout()`** (excluded auth paths: throw only) |
| **403** | CSRF mismatch, registration disabled, forbidden action | **Do not** auto-logout by default — show message; CSRF may need re-login or full page reload |
| **400** | Validation | Form field / toast |
| **404** | Not found | Empty state or 404 page |
| **429** | Throttle | Retry message (login/register) |

Only **`adminClient`** registers the 401 handler. **`publicClient`** never calls `forceLogout`.

### 6.2 `forceLogout()` (single-flight)

```ts
let loggingOut = false;

export async function forceLogout(reason?: "unauthorized" | "manual") {
  if (loggingOut) return;
  loggingOut = true;
  try {
    adminSession.clear(); // immediate — drop admin chrome
    try {
      await adminClient.post("/admin/auth/logout", { skipAuthHandler: true });
    } catch {
      /* ignore — session already dead */
    }
    navigate(`/admin/login?reason=${reason ?? "unauthorized"}`, { replace: true });
  } finally {
    loggingOut = false;
  }
}
```

Register in `adminClient`:

```ts
if (response.status === 401 && !options.skipAuthHandler) {
  await forceLogout("unauthorized");
  throw new ApiError("Session expired", 401);
}
```

Parallel requests: first 401 runs logout; others hit `loggingOut` guard.

### 6.3 `check` vs random 401

- Failed **`check`** on bootstrap → `anonymous`, show login — **no** infinite logout loop (`skipAuthHandler` on logout POST).
- Expired session during work → any admin API 401 → `forceLogout`.

### 6.4 User messaging

Read `reason` query on login page: “Your session expired. Sign in again.”

### 6.5 Implementation (F4)

Helpers in [`src/lib/api/errors.ts`](../src/lib/api/errors.ts):

| Helper | Use |
|--------|-----|
| `getApiErrorMessage` / `getApiErrorUserMessage` | Generic copy; route/boundary and inline alerts |
| `getApiValidationErrors` | `ApiError` 400 → field list from envelope |
| `getAuthFormErrorMessage` | Login (and future register): 400 / 401 / 429 / default |

| Surface | Behavior |
|---------|----------|
| [`routes/admin/login.tsx`](../src/routes/admin/login.tsx) | `reason=session_expired` banner; `getAuthFormErrorMessage` on failed login |
| [`routes/admin/pages/[id].tsx`](../src/routes/admin/pages/[id].tsx) | Load 404 → `EmptyState`; save/publish 400/403 → `siam-alert-error` + field hints |
| Public SSR | 404 → `RouteErrorFallback` (F3) |
| `adminClient` 401 on protected routes | Refresh → `forceLogout` → login with `session_expired` |
| `publicClient` | Never `forceLogout` |

---

## 7. End-to-end flows

### 7.1 Public publication list (SSR)

```text
route.preload → query → publicClient.get('/public/publications')
createAsync(() => getPublications())
Suspense + For + neutral theme rows
```

### 7.2 Admin publication edit

```text
Admin layout → bootstrap check → authenticated
createAsync(() => adminClient.get('/admin/publications/:id'))
Save → adminClient.patch(...) with CSRF
revalidate(publicationQuery.keyFor(id))
```

### 7.3 Session dies mid-edit

```text
PATCH → 401 → forceLogout → login page (unsaved work: warn via beforeunload or local draft — product choice)
```

---

## 8. Environment & security checklist

- [ ] API base URL correct for dev proxy vs prod origin  
- [ ] `credentials: 'include'` only on admin client  
- [ ] CSRF on all admin mutations  
- [ ] No secrets in `VITE_*`  
- [ ] Admin routes guarded client-side; API always enforces `AdminAuthGuard`  
- [ ] 401 → single `forceLogout`; 403 handled case-by-case  
- [ ] Theme tokens used for UI consistency  
- [ ] Icons from `~/icons` barrel only  

---

## 9. Implementation order (suggested)

1. `lib/api` — `ApiError`, `publicClient`, `adminClient` + 401 handler  
2. `lib/auth` — session store, provider, `forceLogout`  
3. Admin layout route + login page  
4. One read + one write screen to validate CSRF and revalidate  
5. Public `query` + preload for first content page  

---

## 10. Related Cursor rules

- `.cursor/rules/siam-frontend-solid.mdc`  
- `.cursor/rules/siam-frontend-tailwind.mdc`  
- `.cursor/rules/siam-frontend-api.mdc`  

---

## Changelog

| Date | Change |
|------|--------|
| 2026-10-14 | Initial combined guide: theme, API, admin auth, 401 logout |
| 2026-10-16 | Link monorepo [local-development.md](../../docs/local-development.md); F0 env/SSR runbook |
| 2026-10-16 | F1: root ErrorBoundary, PublicFooter, branded 404 |
