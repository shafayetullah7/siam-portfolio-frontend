# SolidJS & SolidStart: Comprehensive AI Coding Correctness Guide

> **Reference date:** 14 October 2026. **Primary target:** stable SolidJS 1.x, SolidStart 2.x, and official Solid Router 1.x. Verify the repository's actual dependency versions before applying any rule. SolidStart 2 supports TanStack Solid Router as an alternative; its APIs must not be mixed with official Solid Router APIs.
>
> **Purpose:** Prevent AI coding agents from transplanting React/Next.js conventions into SolidJS/SolidStart. Distinguish **invalid**, **valid but non-idiomatic**, and **architecture-dependent** patterns. This is a review and implementation guide, not a claim that every alternative is prohibited.

## 0. Mandatory preflight for every coding task

1. Inspect `package.json`, lockfile, `vite.config.ts` or legacy `app.config.ts`, `src/app.tsx`, route files, server plugin, and existing patterns.
2. Identify SolidJS, SolidStart, router (official or TanStack), Vite, Nitro/adapter, runtime, and deployment versions. Do not assume the latest version is installed.
3. Decide whether code executes on the server, browser, both, or during build/prerendering; identify SSR/hydration implications.
4. Identify state ownership (local, shared client, request-specific server, durable backend) and data lifecycle (load, preload, mutate, invalidate, stream).
5. Choose the least complex correct primitive; explain non-obvious effects, caches, hydration boundaries, and SSR decisions.
6. Validate against installed typings and official documentation, then run typecheck, tests, and production build.

### Severity labels

- **INVALID:** API absent or semantics broken.
- **RISK:** Compiles but likely breaks reactivity, ownership, SSR, caching, or UX.
- **CHOICE:** Valid alternatives; select based on requirements rather than a universal rule.

## 1. Execution model and fine-grained reactivity

**Fundamental:** A Solid component normally executes once per mounted instance; its tracked computations and DOM bindings update independently. In SSR and hydration, component execution occurs in the relevant environment, so “once” does not mean once globally or across server and client.

| React habit / AI failure | Solid guidance | Severity |
|---|---|---|
| Assume signal update re-executes component | Track reads inside JSX, memos, effects, or accessors | RISK |
| `useState`, `useEffect`, `useMemo`, `useCallback`, `React.memo` | `createSignal`, `createEffect`, `createMemo`, ordinary functions; memoize only when useful | INVALID/RISK |
| `count` instead of `count()` | Signal getters are callable accessors | INVALID |
| `const doubled = count() * 2` at setup for live UI | `const doubled = () => count()*2` or `createMemo` | RISK |
| Effect-driven derived state | Prefer derivation; reserve effects for external side effects | RISK |
| React dependency array on `createEffect` | Solid tracks synchronous reactive reads automatically; second arg is an initial value | RISK |
| Assume a dependency read after `await` is tracked | Track dependencies synchronously before async boundary | RISK |
| Treat setter as React render scheduling | Setters synchronously propagate through reactive graph (subject to batching/scheduling) | RISK |

```tsx
import { createSignal, createMemo, createEffect } from "solid-js";
const [quantity, setQuantity] = createSignal(2);
const price = () => 50;
const total = createMemo(() => quantity() * price());
createEffect(() => console.log("total", total()));
```

### Tracking, scheduling, and ownership

- `createMemo` caches a derived computation and exposes an accessor; a plain function is often enough for inexpensive derivation.
- `createEffect` tracks reactive reads and is intended for effects, not general data modeling. `createRenderEffect` has different timing; don't substitute casually.
- `batch` groups dependent updates; `untrack` deliberately suppresses tracking. Do not use either to hide a faulty reactive design.
- `on(deps, fn, { defer })` is for explicit dependency selection; it is not a React dependency-array API.
- `onMount` is for client mount behavior; `onCleanup` must clean listeners, timers, observers, and subscriptions.
- Ownership matters: `getOwner`, `runWithOwner`, `createRoot` can be necessary for computations created in callbacks or async flows. Do not scatter roots or call hooks/primitives from arbitrary asynchronous functions without understanding lifetime and disposal.
- Tracking does not automatically continue across `await`. Capture signals synchronously and consider request and owner scope before resuming.

## 2. Props, defaults, destructuring, and children

| Mistake | Preferred behavior | Severity |
|---|---|---|
| `function Card({ name })` when `name` changes | Keep `props.name` reactive | RISK |
| `const { name } = props` and assume live updates | Use `props.name`, `splitProps`, `mergeProps`, or accessor | RISK |
| Destructure a store proxy and expect all reads to track | Read reactive properties at the point of use | RISK |
| Treat JSX passed as children as inert React elements | Solid JSX can eagerly instantiate DOM/computations; preserve lazy evaluation | RISK |
| Read `props.children` repeatedly without considering lifecycle | Use `children(() => props.children)` when resolving/reusing children | RISK |
| `React.FC`, `ReactNode`, `cloneElement`, React Context | Solid `Component`, `ParentComponent`, `JSX.Element`, context, composition | INVALID |
| Call component as a plain function for rendering | Prefer JSX `<Component />` or `<props.Component />` | RISK |
| Destructured default parameters for reactive props | `mergeProps(defaults, props)` | RISK |

```tsx
import { mergeProps, splitProps, children, type JSX, type Component } from "solid-js";
function Heading(incoming: { title?: string; children?: JSX.Element }) {
  const props = mergeProps({ title: "Untitled" }, incoming);
  const resolved = children(() => props.children);
  return <section><h2>{props.title}</h2>{resolved()}</section>;
}
function Frame(props: { Header: Component<{ title: string }>; title: string }) {
  return <props.Header title={props.title} />;
}
```

**Component passing distinctions:** Pass a component reference when the child must instantiate it; pass JSX when the caller owns rendered content; pass a render function when deferred instantiation or parameters are needed. Avoid invoking `props.Header()` directly as a general replacement for JSX. Beware that component functions passed through dynamic props need correct capitalization / JSX syntax.

## 3. State, stores, and shared state

| Use case | Preferred tool | Watch for |
|---|---|---|
| Scalar / small local value | `createSignal` | Accessor reads; no rerender assumption |
| Cheap derived value | Accessor function | Don't capture initial snapshot |
| Cached derived computation | `createMemo` | Avoid redundant memo chains |
| Structured nested mutable reactive data | `createStore` from `solid-js/store` | Proxy tracking, path setters |
| Deep updates / merging server data | `setStore`, `produce`, `reconcile` where appropriate | Identity, replacement semantics, stale fields |
| Shared client state | Context with signal/store; dedicated store if justified | Provider scope and lifetime |
| Server request identity / session | Request-scoped server context/session | Never use mutable module singleton |
| Persistent durable data | Backend/database | Don't pretend browser state is durable |

```tsx
import { createStore, produce, reconcile } from "solid-js/store";
const [cart, setCart] = createStore({ items: [{ id: "p1", qty: 1 }] });
setCart("items", 0, "qty", q => q + 1);
setCart(produce(draft => { draft.items.push({ id: "p2", qty: 1 }); }));
// Reconcile only when identity and replacement semantics fit the incoming dataset.
setCart("items", reconcile([{ id: "p1", qty: 2 }], { key: "id" }));
```

- `unwrap` produces nonreactive underlying values; do not use it for live reactive rendering.
- Store proxies track property access, not destructured primitive snapshots.
- Avoid duplicating server query data into local stores unless an editable draft, optimistic view, or other explicit need exists.
- Context itself is not automatically a React-style rerender trigger; pass reactive values/accessors as needed.
- Avoid mutable module-scope authenticated user, tenant, cart, locale, or request-specific state in SSR processes.

## 4. JSX, DOM, events, forms, and lists

| React convention | Solid convention / caveat |
|---|---|
| `className`, `htmlFor` | Prefer `class`, `for`; `className` may work as alias, so don't call it categorically invalid |
| `onChange` for each keystroke | Use `onInput` for input-as-you-type; `onChange` has native change semantics |
| React synthetic events | Solid uses native DOM events and delegated handlers for certain event names |
| Assume `onClick` and `on:click` equivalent | Delegated and native listener behavior differ; consider propagation and target |
| React `useRef` | Solid `ref` variable/callback; use after mount |
| `dangerouslySetInnerHTML` | Solid `innerHTML`, with same untrusted-HTML/XSS caution |
| `createPortal` | Solid `<Portal>` |
| `items.map` everywhere | Prefer `<For>` for dynamic item identity, `<Index>` for stable index slots; `.map` is not always invalid |
| React `key` prop on `<For>` children | `<For>` reconciles by item identity; don't transplant React key rules |
| Nested ternaries for all branches | `<Show>`, `<Switch>`, `<Match>` when they improve correctness/readability |

```tsx
import { For, Index, Show, Switch, Match } from "solid-js";
<For each={products()}>{(product, index) => <p>{index()}: {product.name}</p>}</For>;
<Index each={slots()}>{(slot, index) => <p>{index}: {slot().name}</p>}</Index>;
<Show when={user()} fallback={<p>Sign in</p>}>{u => <p>{u().name}</p>}</Show>;
```

- `<For>` supplies item as value and index as accessor; `<Index>` supplies item as accessor and index as number.
- A list item's identity and position have different consequences for local state and component reuse.
- `classList` and style bindings can update granularly; do not overengineer class-string memoization.
- Native uncontrolled forms and `FormData` can be preferable to making every input a controlled signal.
- Avoid treating Solid's ref and event lifecycles as React callback-ref or synthetic-event lifecycles.
- Use DOM APIs only in browser-safe lifecycle and with cleanup.

## 5. Data fetching decision tree

**First question:** Is this route data, lower-level async state, client-only data, or a specialized server/API integration?

| Need | Default consideration | Not a blanket requirement |
|---|---|---|
| SSR-capable route data, caching, preload | Official Solid Router `query` + `createAsync` | Not required for every fetch |
| Structured async data with store semantics | `createAsyncStore` where installed/appropriate | Check router version |
| Low-level async fetch with explicit source/refetch/loading | `createResource` | Not obsolete |
| Client-only widget | Resource or client-side request in mount lifecycle | `onMount` can be valid |
| Complex normalized cache, pagination, stale policy | TanStack Query Solid or equivalent | Don't add a second cache without reason |
| External API/webhooks | API route / backend service | Not every call must be a framework action |
| Realtime updates | WebSocket/SSE subscription + cleanup | Don't fetch repeatedly via effects by default |

```tsx
import { createAsync, query, type RouteDefinition } from "@solidjs/router";
import { For, Suspense } from "solid-js";

type Product = { id: string; name: string };
const getProducts = query(async (): Promise<Product[]> => {
  "use server";
  // Call server-only database/service code here; authenticate and authorize.
  return [{ id: "1", name: "Example" }];
}, "products");

export const route = {
  preload: () => getProducts(),
} satisfies RouteDefinition;

export default function ProductsPage() {
  const products = createAsync(() => getProducts());
  return <Suspense fallback={<p>Loading products…</p>}>
    <For each={products()}>{p => <p>{p.name}</p>}</For>
  </Suspense>;
}
```

**Rules:**
- Define reusable queries outside the component; a `query` definition is not a fetch until called.
- `createAsync` exposes an accessor that may be `undefined` until resolved; use Suspense, defaults, or guards intentionally.
- Query inputs must be derived reactively, e.g. `createAsync(() => getProduct(params.id))`; avoid snapshots of route params.
- Route `preload` can warm queries before rendering; do not wait for `onMount` by default.
- Query deduplication and caching are scoped and time-sensitive; don't assume an infinite normalized cache or global cross-request cache.
- Confirm query key conventions (`query.key`, `query.keyFor`) and invalidation API against installed router version.
- Don't fetch private backend services from the browser merely because a Next.js example fetches in a component.
- Avoid redundant fetching layers (route preload + independent onMount fetch + store copy).
- Explicitly handle not-found, unauthorized, empty, error, and background-refresh states.
- Understand SSR serialization limitations: only return data supported by the configured serializer; do not leak secrets.

## 6. Mutations, submissions, forms, optimistic UI

| React/Next transplant | SolidStart consideration |
|---|---|
| Next Server Actions or `useActionState` | Official Solid Router `action`, `useAction`, `useSubmission`, `useSubmissions` as supported |
| Manual `isLoading` for every action | Submission pending/error state may already be available |
| Always POST with `fetch` | Form actions can integrate with router; API endpoints remain valid when needed |
| Always `revalidate()` after every action | Check automatic revalidation first; target invalidation as needed |
| Treat action return as trusted | Server-side auth, validation, authorization, and transactional integrity remain mandatory |
| Optimistic update without rollback | Model pending, failure, rollback, race, and reconciliation |
| Assume redirect is client-only | Check action/server redirect semantics |

```tsx
import { action, useSubmission } from "@solidjs/router";
const createItem = action(async (formData: FormData) => {
  "use server";
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required");
  // Authenticate, authorize, persist, then return a safe result.
  return { ok: true };
}, "createItem");
function ItemForm() {
  const submission = useSubmission(createItem);
  return <form action={createItem} method="post">
    <input name="title" required />
    <button type="submit" disabled={submission.pending}>
      {submission.pending ? "Saving…" : "Save"}
    </button>
  </form>;
}
```

- Form submissions can have multiple concurrent entries; decide whether `useSubmission` or `useSubmissions` is correct.
- Use action submissions for progressive enhancement when supported and tested; do not assume identical behavior across deployment environments.
- Design idempotency and concurrency controls for payments, orders, inventory, and retries.
- Do not assume every mutation must be coupled to a route query; backend REST/GraphQL may be an intentional architecture.
- Treat CSRF, cookie settings, authorization, and redirect destinations as security concerns, not just UI details.

## 7. Routing, layouts, links, params, and navigation

- SolidStart 2's filesystem routing maps `src/routes/index.tsx` to `/`, `[id].tsx` to dynamic segments, `[[id]].tsx` to optional segments, and `[...slug].tsx` to catchalls. A default export represents UI route; HTTP method exports represent API handlers.
- With the official router, use `<A>`, `useNavigate`, `useParams`, `useSearchParams`, `useLocation`, and supported route config. Do not import `next/link`, `next/navigation`, `next/router`, `NextRequest`, or `NextResponse`.
- Nested routes/layouts and their lifetimes are not automatically identical to Next.js App Router `layout.tsx`/`template.tsx` semantics. Verify where `<Outlet>` renders and what persists across navigation.
- Search params and route params are reactive; don't destructure/capture values once and assume they update.
- `navigate()` is not Next's `router.push()`, and router revalidation is not `router.refresh()`.
- Route preload and link preload are separate from rendering; use them to reduce waterfalls when appropriate, without assuming Next.js prefetch rules.
- Scroll restoration, redirects, relative navigation, guards, and error boundaries must follow the installed router's APIs.
- Distinguish client-side navigation from document requests, and route errors from HTTP errors.
- Do not mix TanStack Solid Router's loaders/navigation/search validation with official Solid Router's `query`/`createAsync` unless deliberately integrating supported interfaces.

## 8. Loading on navigation, Suspense, and errors

**Different states must remain different:**

1. Navigation pending (`useIsRouting` where supported).
2. Route query first load or revalidation.
3. `<Suspense>` awaiting an async dependency.
4. Action submission pending.
5. Lazy component chunk loading.
6. Background refresh with already-visible data.
7. Empty data and genuine error states.

- Place Suspense boundaries around the async reads whose fallback should replace content; avoid one giant boundary by default.
- Nested Suspense boundaries support independent sections; their behavior differs between initial SSR, hydration, and subsequent navigation.
- `createAsync` can expose `.latest` for last-resolved data, but choose stale-content behavior deliberately.
- Suspense is not a general boolean spinner, and ErrorBoundary does not substitute for correct server status responses.
- Avoid hiding all previously loaded content on every background refresh unless UX requires it.
- Handle errors with ErrorBoundary and appropriate recovery/refetch; distinguish network, authorization, validation, and not-found cases.
- Use route preload to reduce loading waterfalls; a preloaded route may never show a visible skeleton.
- For streaming SSR, understand when response flushing starts, what a boundary delays, and `deferStream` behavior in `createAsync`.
- Ensure loading UI does not cause layout shift, accessibility regressions, or accidental duplicate form submissions.

## 9. SSR, hydration, request scope, and server functions

### Mental model

1. With SSR enabled, the server receives a request and renders HTML using the app/router.
2. Async resources may resolve before or during streaming, depending on configuration and Suspense boundaries.
3. The browser receives HTML and relevant hydration/serialized data.
4. The browser hydrates interactive bindings and then handles subsequent client-side navigation.
5. Server functions still execute on the server when invoked; not every component function is a server function.

**Avoid Next.js RSC assumptions:** SolidStart does not require Next's `"use client"` directives, RSC payload model, `getServerSideProps`, `getStaticProps`, or Next App Router segment metadata. `"use server"` marks supported server-executed functions, not a Next Server Component boundary.

### SSR safety checklist

- No mutable request-specific module singleton (user, cart, tenant, locale, auth context).
- Request-specific data lives in request context/session or properly scoped server code.
- Browser globals (`window`, `document`, `localStorage`, `navigator`) only in client-safe paths; beware module initialization.
- Server secrets and DB access stay server-only; client bundles must not include privileged modules.
- Authorization is checked on every privileged read and write, not just by hiding routes in UI.
- Do not assume client route guards secure API routes or server functions.
- Server/client render outputs must be hydration-compatible; avoid nondeterministic initial markup (random values, time-dependent text, browser-only conditions) without explicit strategy.
- Serialize only intended data; understand JSON vs other configured serialization behavior.
- Treat cookies, cache headers, streaming headers, and redirects as part of the HTTP contract.
- Test concurrent users/tenants to catch cross-request data leaks.
- Do not create ownerless reactive computations in long-lived server modules.

## 10. Rendering model selection and deployment

| Model | Appropriate when | Risks / checks |
|---|---|---|
| CSR | Private dashboards, browser-only interactions, no need for SSR HTML | First content delay, SEO, auth bootstrap, client waterfalls |
| SSR | Public dynamic pages, initial HTML and SEO, request-specific content | Runtime cost, hydration, per-request isolation, caching |
| Streaming SSR | Independent async sections can progressively resolve | Suspense placement, status/headers, error timing, streaming support |
| Prerender / SSG | Mostly static public pages | Build-time freshness, dynamic routes, deployment plugin capabilities |
| Hybrid architecture | Different workloads need different deployments | Not necessarily a Next-like per-route toggle; may require separate builds/apps or adapter-specific capabilities |

**SolidStart 2 specifics:**
- `solidStart({ ssr: true })` defaults to SSR; `ssr: false` selects client rendering for the app. Do not invent Next.js per-route `dynamic`, `revalidate`, `fetchCache`, or `runtime` segment exports.
- Islands mode is not supported in the documented SolidStart 2 configuration (`experimental.islands` only accepts `false`).
- Prerendering is configured through the selected deployment plugin; with Nitro, it is under the top-level `nitro.prerender` configuration.
- CDN caching, edge runtime, server adapters, cookies, WebSockets, and prerendering are deployment concerns, not implied merely by choosing SSR.
- Select per page based on SEO, freshness, personalization, auth, latency, hosting cost, and interactivity; verify the deployment actually supports the chosen model.

### Example `vite.config.ts` for SolidStart 2 + Nitro

```ts
import { defineConfig } from "vite";
import { solidStart } from "@solidjs/start/config";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [solidStart(), nitro()],
  nitro: {
    preset: "node_server",
    prerender: { routes: ["/"] },
  },
});
```

Verify the exact Nitro preset, Vite version, deployment runtime, and compatibility in the target repository.

## 11. SolidStart v1 vs v2, SolidJS 1 vs 2, and router selection

| Topic | Correct caution |
|---|---|
| SolidStart 1.x | Uses older Vinxi-oriented setup and `app.config.ts`; do not silently rewrite config without migration |
| SolidStart 2.x | Vite Environment API, `vite.config.ts`, Vite 8/9 compatibility per docs, Node 24+ stated in release notes |
| Deployment | SolidStart 2 works with Vite plugins such as Nitro v3, Cloudflare, Netlify; avoid hardcoded Vinxi assumptions |
| SolidJS 1.x | Stable reactivity model targeted by SolidStart 2 |
| SolidJS 2 prerelease | Do not introduce new experimental APIs without explicit opt-in and dependency verification |
| Official Solid Router 1.x | `query`, `createAsync`, `action`, `useSubmission`, `FileRoutes` integration |
| TanStack Solid Router | Different route/data APIs; follow that router's official docs instead |
| Documentation drift | GitHub branch READMEs may describe older alpha or v1; prefer versioned docs and installed package typings |

**Verified release reference:** GitHub release listing shows `@solidjs/start@2.0.5` at the time of review. This is a snapshot, not a guarantee of the version installed in a project.

## 12. Server boundaries, middleware, API routes, and security

- Distinguish server-only utilities, `"use server"` functions, API route handlers, middleware, and deployment plugins.
- SolidStart 2 API routes export HTTP methods such as `GET` and `POST`; do not import Next's `NextRequest` or `NextResponse`.
- Use Web Request/Response and the framework's documented handler types and request context.
- Middleware and request context depend on SolidStart and the server plugin (e.g., Nitro/H3); check the installed APIs.
- Validate untrusted inputs server-side; enforce authorization per resource and tenant; protect sessions and cookies.
- Handle CSRF, CORS, cache headers, file uploads, rate limits, redirects, and secrets explicitly.
- Never serialize sensitive server-side data into client responses.

## 13. Component libraries, styling, metadata, testing

- React packages are not automatically Solid-compatible, even when JSX looks similar.
- Verify Solid support for component libraries, portals, focus management, SSR, and hydration.
- Use Solid-compatible head/meta management; do not import `next/head`, `next/image`, or Next metadata APIs.
- Use Solid `lazy()` for code splitting; code loading and route data loading are separate.
- Use Vite-compatible CSS tooling rather than assuming Next-specific pipelines.
- Use Solid Testing Library and test reactive updates, SSR, hydration, routing, and submissions.
- Run typecheck, tests, and production build; development-only success is insufficient.

## 14. React/Next.js convention blacklist

**Reject by default:** `React.FC`, `ReactNode`, React hooks (`useState`, `useEffect`, `useReducer`, `useMemo`, `useCallback`, `useRef`), React `memo`, React `createPortal`, `next/link`, `next/navigation`, `next/router`, `next/image`, `next/head`, `next/headers`, `next/server`, `NextRequest`, `NextResponse`, `getServerSideProps`, `getStaticProps`, `getStaticPaths`, `"use client"`, Next App Router `loading.tsx`/`error.tsx`/`layout.tsx` semantics, `router.refresh()`, dependency arrays on effects, synthetic event assumptions, and React key-based `<For>` reconciliation.

**Do not falsely blacklist:** `.map()` for static arrays, client-only `onMount` fetching, `className` aliases, ordinary REST endpoints, local form state, or CSR for private apps. These can be valid choices.

## 15. Architecture decision rubric

Before implementation, answer:

1. **Execution:** server, browser, both, or build-time? What happens on hydration?
2. **Ownership:** component, route, client provider, request-specific server, or backend?
3. **Fetch:** `query/createAsync`, `createAsyncStore`, `createResource`, API request, or specialized cache? Why?
4. **Preload:** when can data loading start, and how is it deduplicated?
5. **Mutation:** action, form, API route, or backend endpoint? Pending/error/retry/optimistic semantics?
6. **Invalidation:** automatic action revalidation, targeted query invalidation, full reload, or cache update?
7. **Loading:** initial Suspense, retained stale content, navigation indicator, or submission state?
8. **Rendering:** CSR, SSR, streaming, or prerender? Supported by deployment?
9. **Security:** request isolation, authentication, authorization, CSRF, secrets, tenant boundaries?
10. **Verification:** reactive updates, navigation, hydration, concurrent requests, production build?

### Worked examples

**Public product detail:** Prefer SSR when SEO matters; query keyed by reactive route param, route preload, local Suspense, careful cache freshness, server-side stock/price validation at checkout.

**Seller dashboard:** SSR or CSR based on deployment and UX; authenticated server reads, local signals/stores for filters and drafts, persisted queries, mutation with targeted invalidation, no module-level seller session.

**Admin order table:** Reactive search params, query pagination, retained data when useful, per-row submission state, server authorization, safe optimistic reconciliation.

**Realtime notifications:** Initial query/resource plus client-only SSE/WebSocket subscription, cleanup, deduplication, reconnection. Never open sockets during SSR.

**Checkout:** Server-validated totals and inventory, idempotent order creation, session isolation, explicit pending/error UX, no trust in client-submitted prices.

## 16. AI agent acceptance checklist

- [ ] Installed SolidJS/SolidStart/router versions and deployment identified.
- [ ] No accidental React/Next imports, directives, or file conventions.
- [ ] Props, stores, and signals retain reactivity; no snapshots.
- [ ] Component and children passing respects ownership and lazy evaluation.
- [ ] Effects represent real side effects and have cleanup.
- [ ] State is correctly scoped; no SSR cross-request leakage.
- [ ] Data fetching and preloading avoid redundant waterfalls.
- [ ] Query keys, cache behavior, and invalidation verified.
- [ ] Mutations validate and authorize server-side; pending/error states handled.
- [ ] Routing APIs match the selected router; params/search remain reactive.
- [ ] Suspense, errors, navigation, and submissions are not conflated.
- [ ] SSR, hydration, and serialization paths tested.
- [ ] Rendering strategy supported by actual deployment.
- [ ] API routes, middleware, and server functions match framework version.
- [ ] Typecheck, tests, and production build pass.

## 17. Compact AGENTS.md policy

> You are implementing SolidJS/SolidStart, **not React/Next.js**. Inspect installed versions and router choice before coding. Preserve fine-grained reactivity, reactive props, stores, ownership, and SSR request isolation. Choose data primitives based on lifecycle; prefer official router `query/createAsync` and `action` when appropriate, without banning valid alternatives. Use preloading and Suspense intentionally; distinguish navigation, resource, mutation, and background refresh states. Never invent Next.js directives, route files, caching APIs, per-route rendering switches, or RSC semantics. Verify Vite configuration and deployment plugin. Consult versioned official docs and installed typings for uncertain APIs. Explain execution environment, state owner, fetching/mutation, invalidation, loading UX, rendering strategy, and security boundaries. Test SSR, hydration, routing, and production build.

## 18. Official references

Reviewed against official docs and release information on **14 October 2026**:

- https://docs.solidjs.com/
- https://docs.solidjs.com/solid-start/v2
- https://docs.solidjs.com/solid-start/v2/building-your-application/data-fetching
- https://docs.solidjs.com/solid-start/v2/building-your-application/data-mutation
- https://docs.solidjs.com/solid-start/v2/building-your-application/routing
- https://docs.solidjs.com/solid-start/v2/reference/config/solid-start
- https://docs.solidjs.com/solid-start/v2/reference/entrypoints/vite-config
- https://docs.solidjs.com/solid-router/data-fetching/queries
- https://docs.solidjs.com/solid-router/reference/data-apis/create-async
- https://github.com/solidjs/solid-start/releases

**Caution:** Framework APIs evolve. This guide targets verified stable SolidStart 2 / Solid 1 conventions, not every experimental Solid 2 API. Installed package types are authoritative for an individual project.
