# LP2 checklist — hero, affiliation, and primary CTAs

Use with [landing-page-phases.md](./landing-page-phases.md) § LP2.

## Engineering (LP2)

- [x] [`HeroBlock.tsx`](../src/components/landing/HeroBlock.tsx) — split `lg` grid; mobile order copy → CTAs → portrait
- [x] Portrait — lazy load, aspect ratio wrapper, omit when `portrait` null or empty `alt`
- [x] [`AffiliationStrip.tsx`](../src/components/landing/AffiliationStrip.tsx) + [`affiliationFormat.ts`](../src/components/landing/affiliationFormat.ts)
- [x] [`HomeHeroRegion.tsx`](../src/components/landing/HomeHeroRegion.tsx) — hero + strip; no affiliation `h2` stub
- [x] [`HomeLandingSections.tsx`](../src/components/landing/HomeLandingSections.tsx) — wired; `HomeHeroStub` removed

## Exit criteria (LP2)

- [x] Keyboard tab order: hero copy → CTAs → next section (portrait non-focusable)
- [x] No layout shift from hero image when portrait is used (aspect-ratio box)
- [x] Token-based text/button contrast (existing `siam-btn-*`, `text-ink-muted`)
- [x] `pnpm typecheck` clean

## Next

- LP3 (done) — see [landing-page-lp3-checklist.md](./landing-page-lp3-checklist.md).
