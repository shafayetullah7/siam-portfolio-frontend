# SolidJS & SolidStart — SIAM frontend guide

**Versions (this repo):** `solid-js` **1.9.14**, `@solidjs/start` **2.0.0**, `@solidjs/router` **1.0.0**, Vite **8.x**, Nitro via Start. See `package.json` / `pnpm-lock.yaml` before applying any pattern from the web.

**Router:** Official **Solid Router** only — do **not** mix TanStack Solid Router APIs with `query` / `createAsync` from `@solidjs/router`.

**JSX:** `jsxImportSource: "solid-js"` — not React.

**Extended reference:** [solid-solidstart-reference.md](./solid-solidstart-reference.md) (full tables, rubric, worked examples).  
**Cursor rule:** `.cursor/rules/siam-frontend-solid.mdc`

**Official docs:** [Solid](https://docs.solidjs.com/) · [Solid Start v2](https://docs.solidjs.com/solid-start/v2) · [Router data APIs](https://docs.solidjs.com/solid-router/data-fetching/queries)

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

- **Component reference** — child instantiates: `icon: Component` → `<Dynamic component={props.icon} />` or `<props.icon />`.
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

**Decision:**

| Need | Default in SIAM |
|------|------------------|
| SSR route data, preload, cache | `query` + `createAsync` + route `preload` |
| Low-level async with manual refetch | `createResource` |
| Public read via REST | `query` wrapping `fetch` to `/api/v1/public/...` |
| Admin read/write | `fetch` with `credentials: 'include'` + `X-XSRF-TOKEN` on mutations ([admin-auth](../../siam-api/docs/admin-auth.md)) |
| Client-only widget | `onMount` + resource or signal — CHOICE |

```tsx
import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { For, Suspense } from "solid-js";

type Item = { id: string; name: string };

const getItems = query(async (): Promise<Item[]> => {
  "use server";
  // Server-only: DB or internal service — auth here.
  return [];
}, "items");

export const route = {
  preload: () => getItems(),
} satisfies RouteDefinition;

export default function ItemsPage() {
  const items = createAsync(() => getItems());
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <For each={items()}>{(item) => <p>{item.name}</p>}</For>
    </Suspense>
  );
}
```

**Rules:**

- Define `query` **outside** the component; call inside `createAsync(() => getX(...))` with **reactive** params (`params.id`, not a one-time snapshot).
- Avoid preload + `onMount` fetch + store copy for the same data.
- Handle empty, error, 401/404; never leak secrets in serialized responses.

---

## 7. Mutations & forms

Use router **`action`**, **`useSubmission`** / **`useSubmissions`** when using form actions — not Next Server Actions.

```tsx
import { action, useSubmission } from "@solidjs/router";

const saveItem = action(async (formData: FormData) => {
  "use server";
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");
  return { ok: true };
}, "saveItem");

function ItemForm() {
  const submission = useSubmission(saveItem);
  return (
    <form action={saveItem} method="post">
      <input name="title" required />
      <button type="submit" disabled={submission.pending}>
        {submission.pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
```

Admin CMS: validate on server; CSRF on POST/PUT/PATCH/DELETE to `siam-api`.

---

## 8. Routing (this repo)

| Piece | SIAM |
|--------|------|
| Files | `src/routes/` — `index.tsx`, `[id].tsx`, `[[optional]].tsx`, `[...404].tsx` |
| App shell | `app.tsx`: `Router` + `FileRoutes`; `root` = Nav + `Suspense` + children |
| Links | `<A href="…">` from `@solidjs/router` |
| Params / search | `useParams`, `useSearchParams`, `useLocation` — **reactive**; don’t destructure once |
| Layouts | Not Next `layout.tsx` — use nested routes + `<Outlet>` per Start docs |
| API routes | HTTP method exports on route modules — not `NextResponse` |

Path alias: `~/` → `src/`.

---

## 9. Loading, Suspense, errors (keep separate)

1. Navigation pending (`useIsRouting` where available)  
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

## References

- [solid-solidstart-reference.md](./solid-solidstart-reference.md) — full extended guide  
- [Solid Start v2 — data fetching](https://docs.solidjs.com/solid-start/v2/building-your-application/data-fetching)  
- [Solid Start v2 — data mutation](https://docs.solidjs.com/solid-start/v2/building-your-application/data-mutation)  
- [createAsync](https://docs.solidjs.com/solid-router/reference/data-apis/create-async)
