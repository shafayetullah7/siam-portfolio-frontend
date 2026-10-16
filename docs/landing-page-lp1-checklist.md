# LP1 checklist — page shell and section framework

Use with [landing-page-phases.md](./landing-page-phases.md) § LP1.

## Engineering (LP1)

- [x] [`LandingSection.tsx`](../src/components/landing/LandingSection.tsx) — `id`, `aria-labelledby`, optional kicker, `h2`
- [x] [`LandingPage.tsx`](../src/components/landing/LandingPage.tsx) — `main#main`, container padding, vertical `gap`
- [x] [`HomeHeroStub.tsx`](../src/components/landing/HomeHeroStub.tsx) — single `h1`, descriptor, positioning, CTAs from `homeContent.hero`
- [x] [`HomeLandingSections.tsx`](../src/components/landing/HomeLandingSections.tsx) — `listVisibleSectionIds`; non-hero stubs point to LP2–LP5
- [x] [`homeSectionLabels.ts`](../src/components/landing/homeSectionLabels.ts) + unit test
- [x] [`routes/index.tsx`](../src/routes/index.tsx) — static `homeContent`; meta from `seo` + `getPublicSite()`; no `getPublicHome()` on `/`
- [x] Dev-only design-preview links and `ApiStatus` (not in production hero path)

## Exit criteria (LP1)

- [x] Single scrollable page with labeled sections and correct heading order (`h1` once in hero)
- [x] Empty optional sections omitted from DOM (`listVisibleSectionIds`)
- [x] `pnpm typecheck` clean

## Next

- LP2 (done) — see [landing-page-lp2-checklist.md](./landing-page-lp2-checklist.md).
