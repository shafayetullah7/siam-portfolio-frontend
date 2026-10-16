# LP6 checklist — polish, accessibility, and performance

Use with [landing-page-phases.md](./landing-page-phases.md) § LP6.

## Engineering (LP6)

- [x] Home [`index.tsx`](../src/routes/index.tsx) — `og:title`, `og:description`, canonical `Link`
- [x] [`getSiteOrigin()`](../src/lib/site/siteOrigin.ts) shared with sitemap/robots
- [x] [`RevealInView`](../src/components/landing/RevealInView.tsx) + [`LandingSectionReveal`](../src/components/landing/LandingSectionReveal.tsx) + `.siam-reveal` in [`app.css`](../src/app.css)
- [x] `scroll-mt-20` on landing section anchors; descriptive `aria-label` on key card/pub links
- [x] [`LandingPage.spec.tsx`](../src/components/landing/LandingPage.spec.tsx) smoke test
- [x] Static home note in [frontend-developer-guide.md](./frontend-developer-guide.md)

## Exit criteria (LP6)

- [x] `pnpm build` succeeds; dev-only home footer still gated by `import.meta.env.DEV`
- [x] Nav/footer unchanged (`PublicSiteProvider` / `getPublicSite`)
- [ ] P01 static slice — researcher sign-off (manual; see content-packet / LP0 checklist)

## Manual QA

- [ ] 320px / 768px / 1280px layout
- [ ] `/#research-focus` scroll target not clipped (`scroll-margin`)
- [ ] `prefers-reduced-motion: reduce` — sections appear without scroll fade

## Next

- LP7 — CMS handoff (`getPublicHome`) ([landing-page-phases.md](./landing-page-phases.md) § LP7).
