# LP0 checklist — home content contract

Use with [landing-page-phases.md](./landing-page-phases.md) § LP0. Code lives under [`src/content/`](../src/content/).

## Engineering (LP0)

- [x] `HomePageContent` types in [`home.types.ts`](../src/content/home.types.ts)
- [x] Placeholder [`homeContent`](../src/content/home.content.ts) with file banner
- [x] Bounds + section helpers in [`home.validation.ts`](../src/content/home.validation.ts)
- [x] Unit tests in [`home.validation.spec.ts`](../src/content/home.validation.spec.ts)

## P01 section mapping

| `HomePageContent` field | P01 section | Content packet | Permissions ([content-permissions.md](../../docs/content-permissions.md)) |
|-------------------------|-------------|----------------|-------------------------------------------------------------------------------|
| `hero` | Hero identity + CTAs | [identity.md](../../docs/content-packet/identity.md) | Identity and biography |
| `affiliation` | Current affiliation | identity.md | Legal name, headline, role, affiliation |
| `researchFocus` | Research focus (3–6) | [research-themes.md](../../docs/content-packet/research-themes.md) | Research themes / claims |
| `selectedPublications` | Selected publications (2–4) | [publications.bib](../../docs/content-packet/publications.bib) | Publications and scholarship |
| `featuredProjects` | Featured projects (2–3) | [projects/](../../docs/content-packet/projects/) | Projects |
| `highlights` | Verified highlights | [recognition-talks.md](../../docs/content-packet/recognition-talks.md) | Awards / talks (no unsourced metrics) |
| `currentlyWorkingOn` | Currently working on | editorial.md / researcher note | Optional claims |
| `profiles` | Professional profiles | identity.md (academic links) | Academic and social profile links |
| `collaborationCta` | Collaboration CTA | [editorial.md](../../docs/content-packet/editorial.md) | Contact permissions |
| `seo` | Shared metadata | identity + site settings | SEO / public naming |

## Researcher parallel (before launch)

- [ ] [editorial.md](../../docs/content-packet/editorial.md) — top three Home features + tone
- [ ] [identity.md](../../docs/content-packet/identity.md) — name, descriptor, affiliation, links
- [ ] [content-permissions.md](../../docs/content-permissions.md) — `Granted` for each row used on Home
- [ ] Replace placeholders in `home.content.ts` (or swap file content from approved packet)
- [ ] Remove `PLACEHOLDER` banner comment after sign-off

## Replace placeholders (procedure)

1. Copy approved fields from content-packet into `home.content.ts` (keep types unchanged).
2. Run `pnpm test` — `homeContent` must pass `assertHomeContentBounds`.
3. Any highlight with citation/count language needs `sourceUrl` + `asOfDate`.
4. LP1 (done): wire `homeContent` into [`routes/index.tsx`](../src/routes/index.tsx) via [`components/landing/`](../src/components/landing/) — see [landing-page-lp1-checklist.md](./landing-page-lp1-checklist.md).

## Launch gate

- [ ] No `PLACEHOLDER` or bracket names like `[Researcher Name]` on production deploy
- [ ] Researcher factual sign-off per [kickoff.md](../../docs/kickoff.md)
