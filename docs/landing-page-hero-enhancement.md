# Hero section — typography-led enhancement

Complements [landing-page-phases.md](./landing-page-phases.md) LP2 hero work. P01 reference: [AI_ML_Portfolio_Page_by_Page_Content_UX_Requirements.md](../../AI_ML_Portfolio_Page_by_Page_Content_UX_Requirements.md) § P01.

## Components

- [`HeroShell.tsx`](../src/components/landing/HeroShell.tsx) — surface card, research accent bar, left primary border
- [`HeroBlock.tsx`](../src/components/landing/HeroBlock.tsx) — copy column + portrait or [`HeroVisualPlaceholder.tsx`](../src/components/landing/HeroVisualPlaceholder.tsx)
- [`HomeHeroRegion.tsx`](../src/components/landing/HomeHeroRegion.tsx) — shell + affiliation inside card

## Content checklist (researcher)

- [ ] `hero.name` — preferred public name
- [ ] `hero.descriptor` — one professional line
- [ ] `hero.positioning` — 1–2 sentences (what you do + how you collaborate)
- [ ] `primaryCta` — “View research” → `/#research-focus` (or `/research`)
- [ ] `secondaryCta` — “Contact” → `/about#contact` or `/contact`
- [ ] `affiliation` — role, organization, optional location (approved only)
- [ ] `hero.portrait` — optional; replaces motif when `src` + `alt` set

Sources: [content-packet/identity.md](../../docs/content-packet/identity.md), [editorial.md](../../docs/content-packet/editorial.md).

## Manual QA

- [ ] 320px — headline and CTAs before decorative column
- [ ] 1280px — motif or portrait in right column; hero reads as one card
- [ ] Tab order: descriptor → h1 → positioning → CTAs → affiliation
- [ ] `prefers-reduced-motion: reduce` — no extra hero motion beyond page reveal

## P01 acceptance (first screen)

Identity, specialization, and next action visible without scrolling on typical laptop viewport.
