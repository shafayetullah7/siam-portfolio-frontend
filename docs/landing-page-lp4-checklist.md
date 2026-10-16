# LP4 checklist — selected publications and featured projects

Use with [landing-page-phases.md](./landing-page-phases.md) § LP4.

## Engineering (LP4)

- [x] [`isExternalHref.ts`](../src/lib/url/isExternalHref.ts) + unit test
- [x] [`LandingContentLink.tsx`](../src/components/landing/LandingContentLink.tsx) — internal `<A>`; external `<a>` + `ArrowExternal`
- [x] [`PublicationHighlightRow.tsx`](../src/components/landing/PublicationHighlightRow.tsx) / [`PublicationHighlightList.tsx`](../src/components/landing/PublicationHighlightList.tsx) — `siam-pub-row`, title link, significance visible
- [x] [`SelectedPublicationsSection.tsx`](../src/components/landing/SelectedPublicationsSection.tsx)
- [x] [`ProjectCard.tsx`](../src/components/landing/ProjectCard.tsx) / [`ProjectCardGrid.tsx`](../src/components/landing/ProjectCardGrid.tsx) — accent strip, tags, optional image
- [x] [`FeaturedProjectsSection.tsx`](../src/components/landing/FeaturedProjectsSection.tsx)
- [x] [`HomeLandingSections.tsx`](../src/components/landing/HomeLandingSections.tsx) wired for both sections
- [x] No “View all” until `/publications` and `/projects` exist

## Exit criteria (LP4)

- [x] Publication metadata stacks on mobile (`siam-pub-row` flex-col)
- [x] External `href`s show `ArrowExternal` via `LandingContentLink`
- [x] `pnpm typecheck` clean

## Next

- LP5 (done) — see [landing-page-lp5-checklist.md](./landing-page-lp5-checklist.md).
