# LP3 checklist — research focus grid

Use with [landing-page-phases.md](./landing-page-phases.md) § LP3.

## Engineering (LP3)

- [x] [`ResearchFocusCard.tsx`](../src/components/landing/ResearchFocusCard.tsx) — single `<A>` card with title, description, visible “Read more”
- [x] [`ResearchFocusGrid.tsx`](../src/components/landing/ResearchFocusGrid.tsx) — `1` / `sm:2` / `lg:3` column grid
- [x] [`ResearchFocusSection.tsx`](../src/components/landing/ResearchFocusSection.tsx) — `LandingSection` + grid (`id="research-focus"`)
- [x] [`HomeLandingSections.tsx`](../src/components/landing/HomeLandingSections.tsx) — `researchFocus` branch; no stub

## Exit criteria (LP3)

- [x] Each card is one focusable link control with visible text (not hover-only)
- [x] Section omitted when `researchFocus` empty (`listVisibleSectionIds`)
- [x] `pnpm typecheck` clean

## Next

- LP4 (done) — see [landing-page-lp4-checklist.md](./landing-page-lp4-checklist.md).
