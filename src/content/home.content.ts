/**
 * PLACEHOLDER — replace before public launch.
 * Source of truth migration: docs/content-packet/*.md
 *
 * Hero copy: name (no brackets at launch), descriptor (one line), positioning (1–2 sentences).
 * CTAs: primary → /#research-focus until /research exists; secondary → /about#contact until
 * P16 /contact. Portrait: src + alt from content-packet when approved; null uses motif UI.
 */
import type { HomePageContent } from "./home.types";

export const homeContent: HomePageContent = {
  hero: {
    name: "[Researcher Name]",
    descriptor: "Machine learning researcher and builder of thoughtful AI systems",
    positioning:
      "I study reliable learning under real-world constraints—transparency, data limits, and human oversight—so models can earn trust in practice.",
    portrait: null,
    primaryCta: { label: "View research", href: "/#research-focus" },
    secondaryCta: { label: "Contact", href: "/about#contact" },
  },
  affiliation: {
    role: "[Role / title]",
    organization: "[Organization]",
    location: "[City, Country]",
  },
  researchFocus: [
    {
      title: "Theme one (placeholder)",
      description:
        "Short description of a research area. Replace with content from research-themes.md.",
      href: "/about",
    },
    {
      title: "Theme two (placeholder)",
      description: "Another focus area with a clear link to a future research page.",
      href: "/about",
    },
    {
      title: "Theme three (placeholder)",
      description: "Third theme to exercise the 3-column layout on desktop.",
      href: "/about",
    },
  ],
  selectedPublications: [
    {
      title: "Example publication (placeholder)",
      authorsShort: "[Author A], [Author B], …",
      year: 2025,
      venue: "Venue or preprint (placeholder)",
      significance:
        "One sentence on why this work matters—replace with verified copy.",
      href: "/about",
    },
    {
      title: "Second example publication (placeholder)",
      authorsShort: "[Author A] et al.",
      year: 2024,
      venue: "Conference or journal (placeholder)",
      significance: "Significance line for layout testing only.",
      href: "/about",
    },
  ],
  featuredProjects: [
    {
      title: "Example project (placeholder)",
      summary:
        "Problem, approach, and outcome in two sentences. Not a real project until content-packet is approved.",
      href: "/about",
      tags: ["ML", "Prototype"],
    },
    {
      title: "Second example project (placeholder)",
      summary: "Another featured case study for the home grid.",
      href: "/about",
    },
  ],
  highlights: [
    {
      text: "Invited talk at [event name] (placeholder milestone)",
    },
  ],
  currentlyWorkingOn: {
    text:
      "Exploring [active research question]—details will be updated when approved for public sharing.",
    updatedAt: "2026-10-01",
  },
  profiles: [
    { label: "Google Scholar", href: "https://scholar.google.com/" },
    { label: "ORCID", href: "https://orcid.org/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
  // collaborationCta.href: /about until P16 /contact; UI button label is fixed "Contact" (see CollaborationCta.tsx).
  collaborationCta: {
    headline: "Interested in collaborating?",
    body:
      "I welcome conversations about interpretable ML, applied research partnerships, and mentoring—reach out with a short note on your idea.",
    href: "/about",
  },
  seo: {
    title: "Home",
    description:
      "Portfolio home—placeholder copy until researcher-approved content is merged from the content packet.",
  },
};
