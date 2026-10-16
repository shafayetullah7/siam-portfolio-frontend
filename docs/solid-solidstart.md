# SolidJS & SolidStart — SIAM frontend guide

**Versions (this repo):** `solid-js` **1.9.14**, `@solidjs/start` **2.0.0**, `@solidjs/router` **1.0.0**, Vite **8.x**, Nitro via Start. See `package.json` / `pnpm-lock.yaml` before applying any pattern from the web.

**Router:** Official **Solid Router** only — do **not** mix TanStack Solid Router APIs with `query` / `createAsync` from `@solidjs/router`.

**JSX:** `jsxImportSource: "solid-js"` — not React.

**Extended reference:** [solid-solidstart-reference.md](./solid-solidstart-reference.md) (full tables, rubric, worked examples).  
**Cursor rule:** `.cursor/rules/siam-frontend-solid.mdc`

**Official docs:** [Solid](https://docs.solidjs.com/) · [Solid Start v2](https://docs.solidjs.com/solid-start/v2) · [Router queries](https://docs.solidjs.com/solid-router/data-fetching/queries)

**Doc verification:** Sections 6–8 below were checked against Solid Start v2 [data fetching](https://docs.solidjs.com/solid-start/v2/building-your-application/data-fetching), [data mutation](https://docs.solidjs.com/solid-start/v2/building-your-application/data-mutation), [routing](https://docs.solidjs.com/solid-start/v2/building-your-application/routing), [vite.config](https://docs.solidjs.com/solid-start/v2/reference/entrypoints/vite-config), and [`createAsync`](https://docs.solidjs.com/solid-router/reference/data-apis/create-async) (see [§16](#16-doc-verification-summary)).

---

## Severity labels

| Label | Meaning |
|--------|---------|
| **INVALID** | API wrong or semantics broken |
| **RISK** | May compile but breaks reactivity, SSR, cache, or UX |
| **CHOICE** | Valid alternatives — pick by requirement |

---

## 0. Preflight (every task)

1. Read `package.json`, lockfile, `vite.config.ts`, `src/app.tsx`, route files.
2. Decide **where code runs**: server, browser, both, build/prerender.
3. Decide **state owner**: local signal, store, route query, request-scoped server, backend DB.
4. Pick the **simplest correct** primitive; document SSR/hydration and cache boundaries.
5. Run typecheck and `pnpm build` when changing routing or data layer.

---

## 1. Execution model & reactivity

Components **run once per mount** (per environment for SSR). Updates happen via the **reactive graph**, not by re-running the component.

| React / AI habit | Solid | Severity |
|------------------|-------|----------|
| `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef` | `createSignal`, `createEffect`, `createMemo`, `ref`, plain functions | INVALID |
| `count` in JSX | `count()` | INVALID |
| `const doubled = count() * 2` at setup for live UI | `() => count() * 2` or `createMemo` | RISK |
| Effect to derive display state | Derive with accessor/`createMemo`; effects for side effects only | RISK |
| React-style dependency array on `createEffect` | Solid tracks sync reads; 2nd arg is **initial value**, not deps | RISK |
| Read reactive value **after** `await` in effect | Capture synchronously before async boundary | RISK |

```tsx
import { createSignal, createMemo, createEffect } from "solid-js";

const [quantity, setQuantity] = createSignal(2);
const total = createMemo(() => quantity() * 50);
createEffect(() => console.log("total", total()));
```

- `onMount` / `onCleanup` for client lifecycle and teardown.
- `batch`, `untrack`, `createRoot` / `runWithOwner` — use when you understand lifetime (callbacks, async), not by default.

---

## 2. Props, children, passing components

| Mistake | Prefer | Severity |
|---------|--------|----------|
| `function Card({ title })` when `title` must update | `props.title` or `splitProps` | RISK |
| Destructure store proxy and use snapshot in JSX | Read at point of use | RISK |
| `React.FC`, `ReactNode`, `cloneElement` | `Component`, `JSX.Element`, composition | INVALID |
| Call `props.Header()` as default render | `<props.Header />` or `<Dynamic component={props.Header} />` | RISK |
| Reactive defaults via destructuring | `mergeProps({ title: "Untitled" }, props)` | RISK |
| Reuse `props.children` without care | `children(() => props.children)` when resolving | RISK |

**Passing UI:**

- **Component reference** — child instantiates: `icon: Component` → `<props.icon class="size-4" />` (see [design-tokens § Icons](../../docs/design-tokens.md#icons): import from `~/icons` barrel only).
- **JSX slot** — caller owns tree: `props.children`.
- **Render prop** — deferred / parameterized: `renderItem: (x) => JSX.Element`.

```tsx
import { mergeProps, children, type Component, type JSX } from "solid-js";

function Heading(incoming: { title?: string; children?: JSX.Element }) {
  const props = mergeProps({ title: "Untitled" }, incoming);
  const resolved = children(() => props.children);
  return (
    <section>
      <h2>{props.title}</h2>
      {resolved()}
    </section>
  );
}
```

---

## 3. State & stores

| Need | Tool |
|------|------|
| Scalar local | `createSignal` |
| Cheap derived | Accessor or `createMemo` |
| Nested mutable tree | `createStore` + `setStore` / `produce` / `reconcile` |
| Shared client | Context carrying signal/store |
| Durable / authoritative | **siam-api** + DB |

**SSR:** No mutable **module-level** user, cart, tenant, or auth on the server. Request data in server functions / request context.

Do not copy server query results into a local store unless you need an editable draft or optimistic UI.

---

## 4. JSX, DOM, events, lists

| Topic | Guidance |
|--------|----------|
| `class` / `for` | Prefer over `className` / `htmlFor` (aliases may exist — still use Solid style) |
| Text inputs | **`onInput`** for per-keystroke; **`onChange`** for native change semantics |
| Refs | Solid `ref={el => …}` or `let el; ref={el}` — not `useRef` lifecycle |
| Dynamic lists | **`<For each={items()}>`** — identity by item; **`<Index>`** when index-stable slots matter |
| Static short lists | `.map()` is **CHOICE** — OK for fixed menus, not for dynamic keyed lists |
| Conditionals | **`<Show>`**, **`<Switch>` / `<Match>`** when fallback matters |
| React `key` on list children | Not used — `<For>` reconciles by `each` |

```tsx
import { For, Show } from "solid-js";

<For each={products()}>{(p) => <p>{p.name}</p>}</For>
<Show when={user()} fallback={<p>Sign in</p>}>{(u) => <p>{u().name}</p>}</Show>
```

---

## 5. React / Next — reject by default (INVALID)

- `import` from `react` / `react-dom`
- Hooks: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`, …
- **`"use client"`** and Next App Router / RSC model
- `next/link`, `next/image`, `next/navigation`, `next/head`, `next/server`, `NextRequest`, `NextResponse`
- `getServerSideProps`, `getStaticProps`, `generateMetadata`, `router.refresh()`
- React-only UI kits without Solid ports
- `@tanstack/react-query`

**Not the same as Next:** SolidStart **`"use server"`** on **`query`** / **`action`** marks **server-executed functions** — this is **allowed** and expected for Start 2 data APIs.

**Do not over-ban (CHOICE):** static `.map()`, client-only `onMount` fetch, REST to `siam-api`, local form state, CSR for private `/admin` widgets.

---

## 6. Data fetching (SolidStart 2 + official router)

Matches [Solid Start — Data fetching](https://docs.solidjs.com/solid-start/v2/building-your-application/data-fetching): `query` defines cached loading; `createAsync` reads it in the route; optional `"use server"` inside the query body for server-only code (e.g. `useSession`, secrets).

**Decision:**

| Need | Default in SIAM |
|------|------------------|
| SSR route data, preload, cache | `query` + `createAsync` + optional `route.preload` |
| Large nested models | `createAsyncStore` + `query` ([router README](https://github.com/solidjs/solid-router)) — CHOICE |
| Low-level async / non-query cache | `createResource` — **do not** pass `query` as `createResource` fetcher (invalidates wrong) |
| Public HTTP API | `query` + `fetch` to `/api/v1/public/...` — `"use server"` optional if fetch is safe on server only |
| Admin reads | `query` with `"use server"` proxying to `siam-api`, or client `fetch` with cookies — pick per SSR need |
| Client-only widget | `onMount` + resource — CHOICE |

**Official patterns:**

```tsx
import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { ErrorBoundary, For, Suspense } from "solid-js";

// Public list — no "use server" if using public fetch (runs per Start/router rules)
const getPosts = query(async () => {
  const res = await fetch("https://example.com/api/posts");
  return res.json() as Promise<Array<{ id: number; title: string }>>;
}, "posts");

export default function PostsPage() {
  const posts = createAsync(() => getPosts());
  return <For each={posts()}>{(post) => <li>{post.title}</li>}</For>;
}
```

```tsx
// Param + preload + server-only (docs pattern)
const getPost = query(async (id: string) => {
  "use server";
  const res = await fetch(`https://example.com/api/posts/${id}`);
  return res.json();
}, "post");

export const route = {
  preload: ({ params }) => getPost(params.id),
} satisfies RouteDefinition;

export default function PostPage(props: { params: { id: string } }) {
  const post = createAsync(() => getPost(props.params.id));
  return <pre>{JSON.stringify(post(), null, 2)}</pre>;
}
```

**Rules (docs + router README):**

- Every `query` needs a **string key** as the second argument (`"posts"`, `"post"`).
- Define `query` outside the component; use `createAsync(() => getX(...))` so **sync reactive reads** inside the arrow re-run the async work (e.g. `props.params.id`, `searchParams.q`).
- `createAsync` accessor may be **`undefined`** until resolved — use `post()?.title` or wrap with `Suspense` / `ErrorBoundary` ([createAsync examples](https://docs.solidjs.com/solid-router/reference/data-apis/create-async)).
- `route.preload` receives `{ params, location }` — call `getPost(params.id)` to warm cache before render.
- Cache invalidation: `revalidate`, `query.key`, `query.keyFor(id)` — pair with mutations (§7).
- Avoid preload + `onMount` fetch + store copy for the same data.

### 6b. Filtering, search params, and pagination

Matches [useSearchParams](https://github.com/solidjs/solid-router#usesearchparams) (installed `@solidjs/router` README):

- `const [searchParams, setSearchParams] = useSearchParams()` — **proxy**: read `searchParams.page`, `searchParams.q` (strings) to subscribe; do not snapshot into a plain object once.
- **URL-driven filters (P05/P17):** update with `setSearchParams({ year: "2024", q: "transformer" })`; merge/remove via `''` / `undefined` / `null`.
- **Server-backed list:** `createAsync(() => listPublications({ q: searchParams.q, year: searchParams.year }))` where `listPublications` is a `query` taking filter args (reactive when searchParams fields are read inside `createAsync` callback).
- **Client-only filter** on already-loaded data: `createMemo(() => items()?.filter(...))` — CHOICE for small lists only; SIAM search/publications use **API/SQL** for scale ([project-decisions](../../docs/project-decisions.md)).
- **Debounced search:** local signal for input + `createEffect` or explicit submit button that calls `setSearchParams` — do not hammer `setSearchParams` on every keypress unless intended.

---

## 7. Mutations & forms

Matches [Solid Start — Data mutation](https://docs.solidjs.com/solid-start/v2/building-your-application/data-mutation): `action` + `"use server"` when needed; forms use **`method="post"`** (actions are POST-only per router README).

```tsx
import { Show } from "solid-js";
import { action, useSubmission } from "@solidjs/router";

const saveProfile = action(async (formData: FormData) => {
  "use server";
  const displayName = formData.get("displayName")?.toString();
  if (!displayName) throw new Error("Display name is required.");
  return { ok: true };
}, "saveProfile");

export default function ProfilePage() {
  const submission = useSubmission(saveProfile);
  return (
    <form action={saveProfile} method="post">
      <Show when={submission.error}>
        <p>{submission.error?.message}</p>
      </Show>
      <input name="displayName" />
      <button type="submit" disabled={submission.pending}>
        {submission.pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
```

**Also in official docs:**

- **`action.with(arg)`** — prefill leading args (e.g. `archiveProject.with(props.params.id)`).
- **`useSubmissions`** — when multiple concurrent submissions matter.
- **Revalidation** — after mutation, use `revalidate(query.key)` / `query.keyFor(id)` or `redirect(..., { revalidate: … })` from `@solidjs/router` so route `query` data refreshes ([router README](https://github.com/solidjs/solid-router)).
- Keep **read (`query`) and write (`action`)** in the same route module when they share data (Start mutation doc).

**SIAM admin:** use `adminClient` from `~/lib/api` — see [frontend-developer-guide.md](./frontend-developer-guide.md) (auth state, CSRF, **401 → forceLogout**). API contract: [admin-auth](../../siam-api/docs/admin-auth.md).

---

## 8. Routing (this repo)

| Piece | SIAM |
|--------|------|
| Files | `src/routes/` — `index.tsx`, `[id].tsx`, `[[optional]].tsx`, `[...404].tsx` |
| App shell | `app.tsx`: `Router` + `FileRoutes`; `root` = Nav + `Suspense` + children |
| Links | `<A href="…">` from `@solidjs/router` |
| Params / search | `useParams()`; `useSearchParams()` tuple — **proxy**, read properties to subscribe; route pages may use `props.params` in `createAsync(() => get(props.params.id))` per [routing doc](https://docs.solidjs.com/solid-start/v2/building-your-application/routing) |
| Layouts | Not Next `layout.tsx` — use nested routes + `<Outlet>` per Start docs |
| API routes | HTTP method exports on route modules — not `NextResponse` |

Path alias: `~/` → `src/`.

### 8.1 Filename → URL (SolidStart v2)

Official mapping: [Routing](https://docs.solidjs.com/solid-start/v2/building-your-application/routing).

| Pattern | Example file(s) | URL |
|--------|------------------|-----|
| Index | `routes/index.tsx` | `/` |
| Single segment | `routes/about.tsx` | `/about` |
| Nested static | `routes/blog/post.tsx` | `/blog/post` |
| Segment default + siblings | `routes/blog/index.tsx` + `routes/blog/post.tsx` | `/blog`, `/blog/post` |
| Dynamic param | `routes/users/[id].tsx` | `/users/:id` |
| Optional param | `routes/users/[[id]].tsx` | `/users` or `/users/:id` |
| Catch-all | `routes/[...404].tsx` | unmatched paths (SIAM 404 page) |
| HTTP handler | `routes/robots.txt.ts` (`export function GET`) | `/robots.txt` |

**Layout routes:** a module at `routes/admin.tsx` wraps all paths under `/admin/*` (default export receives children; SIAM uses `RouteSectionProps` in [`admin.tsx`](../src/routes/admin.tsx)). Child pages live in `routes/admin/` as siblings of the layout file’s logical tree, not in a Next.js `layout.tsx`.

### 8.2 SIAM conventions (when to use a file vs a folder)

1. **One URL, one page** — use a single route module: `admin/login.tsx` → `/admin/login`. Same for hyphenated paths: `forgot-password.tsx` → `/admin/forgot-password`.
2. **Several URLs under the same path prefix** — use a **directory** with `index.tsx` for the prefix and sibling modules for children:
   - `admin/register/index.tsx` → `/admin/register`
   - `admin/register/verify.tsx` → `/admin/register/verify`
   - `admin/pages/index.tsx` + `admin/pages/[id].tsx` → list + editor
3. **Never** add `admin/<segment>.tsx` **and** `admin/<segment>/` at the same time. SolidStart will register conflicting routes; the wrong page can win (e.g. public 404 on `/admin/register`). If a segment needs children, use **`segment/index.tsx`**, not `segment.tsx`.
4. **Do not** flatten multi-segment URLs into one filename (e.g. `register-verify.tsx` for `/admin/register/verify`) unless the product URL changes — keep filenames aligned with URL segments.
5. **Dynamic segments** live in the folder that matches the static prefix: `admin/pages/[id].tsx`, not `admin/[id].tsx` for page IDs.
6. **Pathless route groups** like `(public).tsx` are mentioned in [frontend-setup-phases.md](./frontend-setup-phases.md) as optional; SIAM does not use them today. Prefer the rules above unless a future refactor is tested against `pnpm build`.

### 8.3 Current route tree (audit)

| URL | File |
|-----|------|
| `/` | `index.tsx` |
| `/about` | `about.tsx` |
| `/design-preview` | `design-preview.tsx` |
| `/*` (404) | `[...404].tsx` |
| `/admin` | `admin.tsx` (layout) + `admin/index.tsx` |
| `/admin/login` | `admin/login.tsx` |
| `/admin/register` | `admin/register/index.tsx` |
| `/admin/register/verify` | `admin/register/verify.tsx` |
| `/admin/forgot-password` | `admin/forgot-password.tsx` |
| `/admin/reset-password` | `admin/reset-password.tsx` |
| `/admin/change-password` | `admin/change-password.tsx` |
| `/admin/pages` | `admin/pages/index.tsx` |
| `/admin/pages/:id` | `admin/pages/[id].tsx` |
| `/admin/site` | `admin/site/index.tsx` |
| `/dev/error-boundary-test` | `dev/error-boundary-test.tsx` |

Admin auth pages intentionally mix **flat** modules (single URL) and the **register/** folder (two URLs). That is consistent with §8.2, not an exception to fix by moving `login` into `login/index.tsx`. See [admin-auth-map.md](./admin-auth-map.md).

---

## 9. Loading, Suspense, errors (keep separate)

1. Navigation pending — `useIsRouting()` signal ([router README](https://github.com/solidjs/solid-router#useisrouting))  
2. Route query load / revalidation  
3. `<Suspense>` around async reads  
4. Action `submission.pending`  
5. Lazy `lazy()` chunk load  
6. Background refresh (may keep stale UI)  
7. Empty vs error  

- Place **Suspense** around the UI that should show each fallback — avoid one global spinner for everything.
- `ErrorBoundary` ≠ HTTP 404 page — use route/error components appropriately.

---

## 10. SSR, hydration, security

- No `window` / `document` / `localStorage` in shared module init; use `onMount` or `isServer` guards.
- Server secrets and DB only in `"use server"` / server utilities — not in client bundles.
- AuthZ on every privileged read/write; hiding `/admin` in UI is not security.
- Hydration-safe markup: no random/time-only first paint without strategy.
- Test concurrent requests — no cross-user leakage via module singletons.

---

## 11. Build & deploy (this repo)

```ts
// vite.config.ts — actual pattern
import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [solidStart(), tailwindcss(), nitro()],
});
```

- Commands: `pnpm dev` / `pnpm build` / `pnpm start` — not `next dev`.
- No SolidStart **0.x** Vinxi-only `app.config.ts` without migration.
- Prerender / preset: configure via Nitro when deploy is chosen — see Start v2 docs.

---

## 12. Styling & meta

- Tailwind v4 + `class` — [tailwind.md](./tailwind.md)
- Tokens — [design-tokens.md](../../docs/design-tokens.md)
- Head: `@solidjs/meta` (`Title`, `Meta`) — not `next/head`
- Document shell: `entry-server.tsx` → `StartServer` `document`

---

## 13. Testing (when added)

- `@solidjs/testing-library` — not `@testing-library/react` alone
- Cover reactive updates, navigation, submissions, production build

---

## 14. Architecture rubric (before coding)

1. Where does it run? Hydration impact?  
2. Who owns state?  
3. `query`/`createAsync` vs `createResource` vs client `fetch`?  
4. Preload timing and deduplication?  
5. Mutation: `action` vs API route vs `siam-api`?  
6. Invalidation strategy?  
7. Which loading UX (Suspense vs navigation vs submission)?  
8. CSR vs SSR vs prerender — supported on host?  
9. Auth, CSRF, tenant isolation?  
10. Typecheck + build green?

---

## 15. Acceptance checklist

- [ ] Versions and official router confirmed  
- [ ] No React/Next imports or file conventions  
- [ ] Signals accessed with `()`; props/stores stay reactive  
- [ ] `<For>` / `<Show>` for dynamic UI; components passed correctly  
- [ ] Effects have cleanup; no SSR module singletons  
- [ ] Data: preload/query pattern; no duplicate waterfalls  
- [ ] Mutations authorized server-side; pending/error handled  
- [ ] Params/search reactive; correct `A` / `navigate`  
- [ ] Suspense vs navigation vs submission not conflated  
- [ ] `pnpm build` passes  

---

## 16. Doc verification summary

| Topic | SIAM guide | Official docs | Status |
|--------|------------|---------------|--------|
| `query` + string key + `createAsync` | §6 | Start data fetching | Aligned |
| `"use server"` inside query/action body | §6–7 | Start fetching/mutation | Aligned — not Next RSC |
| `route.preload` + `RouteDefinition` | §6 | Start fetching + routing | Aligned |
| `action` + `method="post"` + `useSubmission` | §7 | Start mutation | Aligned |
| `submission.pending` / `submission.error` | §7 | Start mutation | Aligned |
| `action.with`, `revalidate`, `keyFor` | §7 | Router README | Added |
| `useSearchParams` for filters | §6b | Router README | Added |
| `createAsync` + `Suspense` / `ErrorBoundary` | §6 | createAsync reference | Aligned (recommended) |
| `query` inside `createResource` fetcher | §6 | Router README | Documented as wrong |
| `FileRoutes` from `@solidjs/start/router` | §8, `app.tsx` | Start routing | Aligned |
| `solidStart()` + `nitro()` in `vite.config.ts` | §11 | Start vite-config | Aligned (+ `tailwindcss()` plugin) |
| Catch-all routes | `[...slug]` in docs | Project has `[...404].tsx` | Verify path at build time; prefer doc naming for new routes |

If installed typings disagree with docs, **typings + lockfile win**.

---

## References

- [solid-solidstart-reference.md](./solid-solidstart-reference.md) — full extended guide  
- [Solid Start v2 — data fetching](https://docs.solidjs.com/solid-start/v2/building-your-application/data-fetching)  
- [Solid Start v2 — data mutation](https://docs.solidjs.com/solid-start/v2/building-your-application/data-mutation)  
- [Solid Start v2 — routing](https://docs.solidjs.com/solid-start/v2/building-your-application/routing)  
- [createAsync](https://docs.solidjs.com/solid-router/reference/data-apis/create-async)  
- [@solidjs/router README](https://github.com/solidjs/solid-router) (queries, revalidate, hooks)
