# API & forms convention (SIAM frontend)

**Pickable spec** for `src/lib/api` and `src/lib/forms`. Parent guide: [frontend-developer-guide.md](./frontend-developer-guide.md).

Inspired by **byte-forge-frontend-2** (`fetcher`, unwrap, auth exclusions, refresh-then-redirect), adapted for **portfolio-style admin cookies** (no Bearer, no OIDC, no i18n).

---

## 1. Principles

| Topic | Rule |
|--------|------|
| **Two clients** | `publicClient` and `adminClient` — never one mixed fetcher for both surfaces |
| **API JSON** | **TypeScript types only** — trust `siam-api`; no Zod (or similar) on responses |
| **Forms** | **Zod** validates user input **before** calling the API |
| **HTTP** | No raw `fetch` in routes/components — only `endpoints/*` → clients |
| **Queries** | `query` + `"use server"` calls **endpoints**, not clients directly from UI |

---

## 2. Folder layout

```text
src/lib/
  api/
    index.ts                 # export clients, ApiError, endpoint groups
    config.ts                # base URL, admin auth exclusions
    types/
      index.ts               # ApiError, ApiResponse, shared DTOs
      public.types.ts        # public list/detail shapes
      admin.types.ts         # admin + AdminProfile, etc.
    internal/
      request.ts             # buildURL, parseBody, unwrapSuccessData
      cookies.ts             # xsrf-token, SSR cookie forward (when needed)
    public-client.ts
    admin-client.ts
    endpoints/
      public/
        publications.api.ts
        search.api.ts
        contact.api.ts
        index.ts
      admin/
        auth.api.ts
        media.api.ts
        index.ts
      index.ts

  forms/
    schemas/                 # Zod only — form/input validation
      login.schema.ts
      publication.schema.ts
    index.ts                 # re-export schemas + helpers
    parse.ts                 # safeParse → field errors map (optional helper)

  auth/                      # session store, forceLogout, guards (see developer guide)
```

---

## 3. URL & path rules

**Base:** `VITE_API_BASE` → full URL, e.g. `http://localhost:5000/api/v1` (no trailing slash).

| Client | Prefix | Example call | Full URL |
|--------|--------|--------------|----------|
| `publicClient` | `/public` | `.get('/publications')` | `/api/v1/public/publications` |
| `adminClient` | `/admin` | `.get('/auth/check')` | `/api/v1/admin/auth/check` |

Endpoint modules use **paths relative to that prefix** (no duplicate `public/public`).

---

## 4. Shared types (no runtime validation)

```ts
/** Nest ResponseService-style envelope (recommended on API). */
export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  error?: string | { code?: string; validationErrors?: FieldError[] };
}

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: ApiFailure | unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface Paginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
```

- **List with meta:** `adminClient.get<Paginated<Publication>>('/publications', { unwrap: false })` then use full body, or define `PublicationListResponse = Paginated<Publication>`.
- **Single resource:** `unwrap: true` (default) → returns `data` only.

Wrong API shape = fix types + API contract; catch with tests/e2e, not client-side Zod.

---

## 5. `publicClient`

**Use for:** all `/api/v1/public/*` (site, contact, search).

| Behavior | Value |
|----------|--------|
| `credentials` | `'omit'` (default) — anonymous reads |
| `credentials: 'include'` | Only if a public endpoint later needs cookies (rare) |
| 401 handling | **None** — throw `ApiError`; no logout, no redirect |
| CSRF | Not required for typical public GET; POST contact if API adds CSRF later |

**API:**

```ts
publicClient.get<T>(path, options?)
publicClient.post<T>(path, body?, options?)
// options: { params?, unwrap?: boolean, headers?, responseType?: 'json' | 'blob' | 'text' }
```

---

## 6. `adminClient`

**Use for:** all `/api/v1/admin/*` including `/admin/auth/*`.

| Behavior | Value |
|----------|--------|
| `credentials` | always `'include'` |
| CSRF | `POST` / `PUT` / `PATCH` / `DELETE` → `X-XSRF-TOKEN` from cookie `xsrf-token` |
| `Authorization` | **Never** — HttpOnly JWT cookies only |
| 401 | See §7 — **not** instant redirect on first 401 without refresh attempt |
| 403 | CSRF-related → **one retry** after token from `Set-Cookie` (byte-forge pattern); other 403 → throw, no logout |

**`strictAuth` (default `true`):** when `false`, 401 does **not** run refresh/logout pipeline (auth probe, login, register).

**Excluded paths** (always `strictAuth: false` — also listed in `config.ts`):

```ts
export const adminAuthExcludedPaths = [
  "/auth/check",
  "/auth/login",
  "/auth/logout",
  "/auth/refresh",
  "/auth/register",
  "/auth/verify-registration",
  "/auth/resend-registration-otp",
  "/auth/registration-status",
  "/auth/forgot-password",
  "/auth/reset-password",
];
```

Match with `path.startsWith` or segment check after prefix.

---

## 7. Admin 401 flow (refresh, then logout)

```text
adminClient request
  → 401?
    → path excluded OR strictAuth: false? → throw ApiError (caller handles)
    → already authRefreshRetried? → forceLogout()
    → POST /admin/auth/refresh (single-flight promise)
         → ok? → retry original request once (authRefreshRetried: true)
         → fail? → forceLogout()
```

**`forceLogout()`** (single-flight): `authStore.clear()` → best-effort `POST /auth/logout` with `skipAuthHandler: true` → `navigate('/admin/login?reason=session_expired', { replace: true })`.

**`publicClient` never calls `forceLogout`.**

---

## 8. Endpoint modules (typed wrappers)

One file per domain; **only** place that knows path strings + HTTP method.

```ts
// endpoints/admin/auth.api.ts
import { adminClient } from "../../admin-client";
import type { AdminProfile } from "../../types/admin.types";
import type { LoginBody } from "~/lib/forms/schemas/login.schema";

export const adminAuthApi = {
  check: () =>
    adminClient.get<AdminProfile>("/auth/check", { strictAuth: false }),

  login: (body: LoginBody) =>
    adminClient.post<AdminProfile>("/auth/login", body, { strictAuth: false }),

  logout: () =>
    adminClient.post<void>("/auth/logout", undefined, { skipAuthHandler: true }),

  refresh: () =>
    adminClient.post<void>("/auth/refresh", undefined, { strictAuth: false }),
};
```

```ts
// endpoints/public/publications.api.ts
import { publicClient } from "../../public-client";
import type { PublicationListParams, PublicationListResponse } from "../../types/public.types";

export const publicationsPublicApi = {
  list: (params?: PublicationListParams) =>
    publicClient.get<PublicationListResponse>("/publications", {
      params,
      unwrap: false,
    }),

  bySlug: (slug: string) =>
    publicClient.get<PublicationDetail>(`/publications/${slug}`),
};
```

Export groups from `endpoints/index.ts`; app code imports `adminAuthApi` or `publicationsPublicApi`, not clients (except auth bootstrap internals).

---

## 9. Solid `query` layer

**Queries call endpoints, not `fetch`.**

```ts
// lib/queries/public/publications.queries.ts
import { query } from "@solidjs/router";
import { publicationsPublicApi } from "~/lib/api/endpoints/public/publications.api";

export const getPublicPublications = query(
  async (params?: PublicationListParams) => {
    "use server";
    return publicationsPublicApi.list(params);
  },
  "public-publications",
);
```

```ts
// Route
export const route = {
  preload: ({ location }) => getPublicPublications(parseSearchParams(location)),
};

const data = createAsync(() => getPublicPublications(filters()));
```

Admin: same pattern with `adminClient` via `endpoints/admin/*`. Session: [`getAdminSession`](../src/lib/api/queries/admin/session.queries.ts) uses [`fetchAdminSession`](../src/lib/api/server/adminSession.server.ts) (cookie-forwarded `GET /auth/check`) and returns `null` on failure (no throw) for layout guards — browser revalidation still uses `adminAuthApi.check()`.

---

## 10. Forms — Zod only here

**Do not** import Zod in `lib/api/types` or endpoint files for response parsing.

| Location | Zod |
|----------|-----|
| `lib/forms/schemas/*.schema.ts` | Yes — fields, min/max, email, etc. |
| `lib/api/**` | No — TypeScript interfaces only |
| Server `"use server"` actions | Zod for **incoming** FormData/JSON from browser if you validate twice; prefer validate once on client + API |

**Pattern:**

```ts
// lib/forms/schemas/login.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

// New passwords (register / reset / change): import adminPasswordSchema from ~/lib/auth/adminPasswordPolicy

export type LoginFormValues = z.infer<typeof loginSchema>;
```

**Default admin mutation (F7):** Router `action` + `form method="post"` + `useSubmission`. Actions return `FormActionResult` from `lib/forms/types.ts`. Parse `FormData` with `parseWithSchema`; on API failure use `mapAdminMutationError` (CMS) or `getAuthFormErrorMessage` (auth). Client-executed actions (no `"use server"`) so `adminClient` CSRF cookies work — see `lib/forms/README.md`.

**API validation errors (400):** map `ApiError.body` `validationErrors` to form fields — still no Zod on the response; read typed `ApiFailure` shape.

Use **Zod 4** consistently with `siam-api` if sharing message style; frontend form schemas can live only in `siam-frontend`.

---

## 11. SSR and CORS

- **`VITE_API_BASE`:** Full `http(s)://host/api/v1` for browser and SSR (default `http://localhost:5000/api/v1`). Relative paths are rejected — no frontend `/api` proxy.
- **Nest:** `CORS_ORIGIN` must equal the app origin (`VITE_SITE_ORIGIN` / where users open the site). `credentials: true` is enabled in `main.ts`; admin uses `credentials: "include"` on `adminClient`.
- **Optional `VITE_API_SSR_ORIGIN`:** Only when SSR must call a different API host than the browser (rare Docker setups); replaces the origin in `VITE_API_BASE` for server-side `fetch` only.
- Layout session read: forward incoming `Cookie` via `fetchAdminSession` (`getAdminSession` query). Other server-side `adminClient` mutations still client-only until CSRF forwarding exists.
- Forward API `Set-Cookie` to the HTML response (Nitro/Start 2 — implement when needed).
- Do not store admin profile in module scope on the server.

---

## 12. Checklist for a new feature

1. Add/update **types** in `lib/api/types/*.types.ts` (manual, from API doc or OpenAPI).
2. Add **endpoint** methods in `endpoints/public` or `endpoints/admin`.
3. Add **`query`** with `"use server"` if route data.
4. Add **form schema** in `lib/forms/schemas` if user input.
5. Route/component: `createAsync` / submit handler only — no `fetch`.
6. Mutation: `adminClient` or `action` + revalidate keys.

---

## 13. What we deliberately skip (vs byte-forge)

| byte-forge | SIAM |
|------------|------|
| OIDC external login redirect | `/admin/login` in-app |
| `Authorization: Bearer` | Cookies only |
| `x-locale` | No i18n |
| Single `fetcher` for all APIs | **publicClient** + **adminClient** |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-10-14 | Dual client convention; TS API types; Zod forms-only; refresh-then-logout |
