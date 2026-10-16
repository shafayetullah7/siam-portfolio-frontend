# LP5 checklist — highlights, current work, profiles, collaboration CTA

Use with [landing-page-phases.md](./landing-page-phases.md) § LP5.

## Engineering (LP5)

- [x] [`HighlightsList.tsx`](../src/components/landing/HighlightsList.tsx) / [`HighlightsSection.tsx`](../src/components/landing/HighlightsSection.tsx)
- [x] [`CurrentlyWorkingOn.tsx`](../src/components/landing/CurrentlyWorkingOn.tsx) / [`CurrentlyWorkingOnSection.tsx`](../src/components/landing/CurrentlyWorkingOnSection.tsx) + [`formatDisplayDate.ts`](../src/components/landing/formatDisplayDate.ts)
- [x] [`ProfileLinks.tsx`](../src/components/landing/ProfileLinks.tsx) / [`ProfilesSection.tsx`](../src/components/landing/ProfilesSection.tsx)
- [x] [`CollaborationCta.tsx`](../src/components/landing/CollaborationCta.tsx) — `surface-muted` band; headline as `h2`; Contact CTA
- [x] [`HomeLandingSections.tsx`](../src/components/landing/HomeLandingSections.tsx) — all sections wired; `SectionStub` removed
- [x] Collaboration `href` documented in [`home.content.ts`](../src/content/home.content.ts)

## Exit criteria (LP5)

- [x] No empty section placeholders (visibility via `listVisibleSectionIds`)
- [x] Collaboration CTA uses `/about` until `/contact` (documented); button label "Contact"
- [x] `pnpm typecheck` clean

## Next

- LP6 (done) — see [landing-page-lp6-checklist.md](./landing-page-lp6-checklist.md).
