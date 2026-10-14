# Tailwind CSS v4 — SIAM frontend guide

**Version in this repo:** Tailwind **v4** (`tailwindcss` + `@tailwindcss/vite` ^4.0.7).  
**Official docs:** [tailwindcss.com/docs](https://tailwindcss.com/docs) · [Upgrade guide (v3 → v4)](https://tailwindcss.com/docs/upgrade-guide)

This project does **not** use Tailwind v3 patterns. Treat v3 blog posts, Stack Overflow answers, and `tailwind.config.js` recipes as **unsafe** unless translated to v4.

---

## How SIAM wires Tailwind

| Piece | Location |
|--------|----------|
| Vite plugin | `vite.config.ts` → `tailwindcss()` from `@tailwindcss/vite` |
| Entry CSS | `src/app.css` → `@import "tailwindcss"` |
| Design primitives | `src/styles/tokens.css` (`--siam-*` on `:root`) |
| Theme → utilities | `src/app.css` → `@theme inline { --color-*: var(--siam-*); … }` |
| Shared classes | `src/app.css` → `@layer components` (`.siam-btn-primary`, etc.) |
| Brand colors in UI | [../../docs/design-tokens.md](../../docs/design-tokens.md) — use `bg-canvas`, `text-ink`, `bg-primary`, not random `sky-*` |

**There is no `tailwind.config.js`.** Theme is CSS-first. Do not add a v3-style config unless you explicitly `@import` it with `@config` (we avoid that).

---

## Do this (v4 conventions)

1. **Import Tailwind once** in `app.css`:
   ```css
   @import "tailwindcss";
   ```
2. **Extend the theme** with `@theme` or `@theme inline` in CSS ([theme variables](https://tailwindcss.com/docs/theme)):
   - Literal values: `@theme { --color-brand: #0b6b5f; }` → `bg-brand`
   - Pointing at `:root` primitives: `@theme inline { --color-primary: var(--siam-primary); }` (required when values are CSS variables)
3. **Use the Vite plugin**, not PostCSS `tailwindcss` as the main pipeline (already configured).
4. **Prefer utilities in JSX** (`class="flex gap-4 text-ink"`). Use `.siam-*` component classes only for repeated composites.
5. **Add new brand tokens** in `tokens.css`, map in `@theme inline`, document in `docs/design-tokens.md`.
6. **Borders:** v4 default border color is `currentColor` — always set color on borders in UI, e.g. `border border-border` (SIAM token).
7. **Opacity:** use slash modifiers — `bg-ink/50`, not `bg-opacity-50`.
8. **Focus:** use `focus-visible:` and/or global styles in `app.css`; for rings use `ring-3 ring-focus` if you need v3-like 3px ring (bare `ring` is 1px in v4).
9. **Spacing lists:** prefer `flex flex-col gap-*` over `space-y-*` when layout is complex (v4 changed `space-*` selectors).
10. **Read current docs** for utilities renamed in v4 (shadows, radius, gradients) — see table below.

---

## Do not do this (common v3 mistakes)

| Mistake | Why it breaks / misleads |
|---------|---------------------------|
| `@tailwind base;` / `@tailwind components;` / `@tailwind utilities;` | **Removed in v4.** Use `@import "tailwindcss"`. |
| Creating `tailwind.config.js` with `theme.extend` only | **Not auto-loaded.** v4 theme lives in CSS `@theme`. |
| `content: ['./src/**/*']` in JS config | v4 scans from the CSS entry; use `@source` only if files are outside normal paths. |
| PostCSS stack: `tailwindcss` + `autoprefixer` + `postcss-import` | v4 Vite plugin handles this; duplicate pipelines cause confusion. |
| `bg-opacity-*`, `text-opacity-*`, `flex-grow-*`, `flex-shrink-*` | **Removed** — use `/opacity` modifiers, `grow-*`, `shrink-*`. |
| `outline-none` for accessible focus hiding | Renamed semantics: use **`outline-hidden`** for invisible outline; `outline-none` is real `outline-style: none`. |
| Bare `ring` expecting 3px blue ring | v4: **`ring` = 1px**, color `currentColor` — use `ring-3 ring-focus`. |
| `shadow-sm` meaning “smallest shadow” | **Scale renamed** — v3 `shadow-sm` ≈ v4 `shadow-xs`; check [upgrade guide](https://tailwindcss.com/docs/upgrade-guide). |
| `rounded-sm` as smallest radius | **Scale renamed** — often v4 `rounded-xs` for old `rounded-sm`. |
| `bg-gradient-to-r` only (old mental model) | v4 prefers **`bg-linear-to-r`**; gradient + variant behavior changed. |
| `container mx-auto` + `theme.container` in config | v4 **`container` options removed** — use `.siam-container` or `@utility container`. |
| `@layer utilities { .foo {} }` for custom utilities needing `hover:` | Prefer **`@utility foo { … }`** so variants work and sort correctly. |
| `!flex` (important at start) | v4: **`flex!`** at end (old syntax deprecated). |
| `bg-[--token]` arbitrary CSS var | v4: **`bg-(--token)`** parentheses form. |
| `theme('colors.red.500')` in CSS | Prefer **`var(--color-red-500)`** from generated theme vars. |
| `resolveConfig()` from `tailwindcss` in JS | **Removed in v4** — use `getComputedStyle` / `var(--color-*)`. |
| Sass/Less on top of Tailwind | **Not supported** in v4 — Tailwind is the preprocessor. |
| Scoped `<style>` / CSS modules with `@apply` without import | Need **`@reference "../app.css"`** or use `var(--color-*)` directly. |
| Default palette `sky-*`, `gray-*` for product UI | Allowed technically, but **violates SIAM design tokens** — use semantic tokens. |
| `hover:` as required behavior on touch | v4 `hover` only when `(hover: hover)` — don’t hide critical actions behind hover-only. |

---

## v3 → v4 renames (high-impact)

Copy-paste from production code will look “wrong” until updated:

| v3 habit | v4 replacement |
|----------|----------------|
| `shadow-sm` | `shadow-xs` |
| `shadow` (default) | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` (default) | `rounded-sm` |
| `blur-sm` / `blur` | `blur-xs` / `blur-sm` |
| `outline-none` (focus) | `outline-hidden` |
| `ring` + color | `ring-3` + `ring-*` color |
| `transform-none` reset | `scale-none` / individual property resets |
| Stacked variants order | v4 applies **left-to-right** (reverse v3 order if behavior differs) |

Full list: [Upgrade guide — Changes from v3](https://tailwindcss.com/docs/upgrade-guide#changes-from-v3).

---

## SIAM-specific workflow

1. **New color or radius** → `tokens.css` → `@theme inline` in `app.css` → `docs/design-tokens.md`.
2. **New repeated button/card pattern** → add `.siam-*` in `@layer components` with `@apply`, or compose utilities in a small Solid component.
3. **New utility that must accept variants** (`hover:siam-chip`) → `@utility siam-chip { … }` in `app.css`.
4. **Admin `/admin`** — same tokens; more `surface` + `border`, less accent backgrounds.
5. **Arbitrary values** — OK for one-offs; don’t bypass tokens for colors that repeat.

---

## Problem points (version confusion)

These cause the most bugs when mixing v3 tutorials with this repo:

1. **`@theme` vs `@theme inline`** — Using `var(--siam-primary)` inside `@theme` **without** `inline` can produce wrong or non-overridable CSS variables. SIAM uses **`@theme inline`** for all token mappings.
2. **Import order** — `tokens.css` must load before `@theme inline` reads `--siam-*` (current `app.css` order is correct).
3. **Border without color** — Looks “broken” after v4 (invisible or wrong). Always `border-border` (or explicit color).
4. **Shadow/radius scale** — UI looks subtly off after copy-paste from v3 mockups; compare against v4 docs.
5. **No `safelist` in JS config** — v4 uses [`@source inline()`](https://tailwindcss.com/docs/detecting-classes-in-source-files) if you need forced classes.
6. **SolidStart** — Keep styling in `class=` on components + global `app.css`; if you add per-component CSS files later, use `@reference` for `@apply`.

---

## Editor (optional but recommended)

Install the **Tailwind CSS IntelliSense** extension. For v4 CSS-first setup, point it at the entry stylesheet (workspace or user settings):

```json
{
  "tailwindCSS.experimental.configFile": "siam-frontend/src/app.css"
}
```

Autocomplete should suggest `bg-canvas`, `text-ink`, etc. after `@theme inline` mappings. If suggestions are stale, reload the window after editing `app.css`.

---

## Dynamic class names

Tailwind only generates utilities it **sees as complete strings** in source. This does **not** work:

```tsx
// BAD — class will not be generated
const tone = "primary";
<div class={`bg-${tone}`} />
```

Use full class names, a map, or `clsx`/`cva` with explicit branches:

```tsx
const variant = "project" as "project" | "writing";
<div class={variant === "project" ? "bg-accent-project" : "bg-accent-writing"} />
```

For CMS-driven labels, prefer **data attributes + CSS** or a fixed allowlist of classes.

---

## Later (feature-driven, not required now)

| When | Add |
|------|-----|
| Article prose (P12) | `@tailwindcss/typography` v4 plugin + `.prose` tuned to SIAM tokens, or extend `.siam-prose` |
| Admin forms (A01+) | `@tailwindcss/forms` (base styles) + SIAM `border-border`, `focus-visible` ring |
| Classes in unusual paths | `@source "../path"` in `app.css` ([docs](https://tailwindcss.com/docs/detecting-classes-in-source-files)) |
| Dark mode | **Out of scope** per [design-tokens.md](../../docs/design-tokens.md) — do not add `dark:` product theme without a decision |

No `postcss.config.*`, `tailwind.config.js`, or Prettier class-sort plugin is required unless the team adopts them explicitly.

---

## References

- [Theme variables](https://tailwindcss.com/docs/theme)
- [Detecting classes in source files (`@source`)](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Adding custom styles (`@utility`, `@layer`)](https://tailwindcss.com/docs/adding-custom-styles)
- [SIAM design tokens](../../docs/design-tokens.md)
