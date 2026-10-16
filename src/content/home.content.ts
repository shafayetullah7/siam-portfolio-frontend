/**
 * PLACEHOLDER — replace before public launch.
 * Source of truth migration: docs/content-packet/*.md
 */
import type { HomePageContent } from "./home.types";

export const homeContent: HomePageContent = {
  hero: {
    name: "[Researcher Name]",
    descriptor: "Machine learning researcher & builder of thoughtful AI systems",
    positioning:
      "I study reliable learning under real-world constraints—transparency, data limits, and human oversight—so models can earn verifiable trust in practice.",
    portrait: null,
    statusBadge: "LIVE DISPATCH",
    contactEmail: "researcher@university.edu",
    primaryCta: { label: "Explore research", href: "/#research-focus" },
    secondaryCta: { label: "Get in touch", href: "/about#contact" },
    ledger: {
      headerLabel: "Scholar ledger",
      metrics: [
        { value: "—", label: "Peer-reviewed pubs" },
        { value: "—", label: "Citations tracked" },
        { value: "—", label: "Open artifacts" },
        { value: "—", label: "Top venues" },
      ],
    },
  },
  affiliation: {
    role: "[Role / title]",
    organization: "[Organization]",
    location: "[City, Country]",
  },
  researchFocus: [
    {
      title: "Interpretable representation learning",
      description:
        "Disentangling latent structure for human-verifiable attribution in deep models. Replace with approved theme copy.",
      href: "/about",
      tags: ["Interpretability", "Attribution", "Latent audits"],
      linkLabel: "Explore theme & preprints",
    },
    {
      title: "Sample-efficient constrained optimization",
      description:
        "Robust learning under data scarcity, physical boundaries, and distribution shift—with selective expert-in-the-loop queries.",
      href: "/about",
      tags: ["Active learning", "Data scarcity", "Optimization"],
      linkLabel: "Explore theme & preprints",
    },
    {
      title: "Human-aligned oversight & governance",
      description:
        "Evaluation suites, stress tests, and safety guarantees before autonomous pipelines enter high-consequence domains.",
      href: "/about",
      tags: ["Safety", "Human oversight", "Evaluation"],
      linkLabel: "Explore theme & preprints",
    },
  ],
  selectedPublications: [
    {
      title: "Example publication title (placeholder)",
      authorsShort: "[Author A], [Author B], …",
      year: 2025,
      venue: "NeurIPS",
      significance:
        "One sentence on why this work matters—replace with verified copy from the content packet.",
      href: "/about",
    },
    {
      title: "Second example publication (placeholder)",
      authorsShort: "[Author A] et al.",
      year: 2024,
      venue: "ICML",
      significance: "Significance line for layout testing only.",
      href: "/about",
    },
  ],
  featuredProjects: [
    {
      title: "Example open-source project (placeholder)",
      summary:
        "Problem, approach, and outcome in two sentences. Not a real project until content-packet approval.",
      href: "/about",
      tags: ["Python", "ML", "Prototype"],
    },
    {
      title: "Second example project (placeholder)",
      summary: "Another featured system for the home grid.",
      href: "/about",
      tags: ["JAX", "Research code"],
    },
  ],
  highlights: [
    {
      badge: "INVITED TALK",
      dateLabel: "2025",
      title: "[Event name] (placeholder)",
      text:
        "Short description of the talk or milestone. Replace with verified highlights from the content packet.",
    },
  ],
  currentlyWorkingOn: {
    headline:
      "“Can we bound adversarial perturbation in multimodal systems under real-world constraints?”",
    text:
      "Exploring whether geometric structure in latent space predicts failure modes before deployment—details updated when approved for public sharing.",
    updatedAt: "2026-10-01",
    statusLabel: "Status: Empirical validation",
    statusDetail: "Stage 3 of 4",
  },
  profiles: [
    { label: "Google Scholar", href: "https://scholar.google.com/", subtitle: "Profile" },
    { label: "ORCID", href: "https://orcid.org/", subtitle: "Verified ID" },
    { label: "GitHub", href: "https://github.com/", subtitle: "@researcher" },
    { label: "arXiv", href: "https://arxiv.org/", subtitle: "Author feed" },
  ],
  collaborationCta: {
    headline: "Interested in collaborating or exploring research partnerships?",
    body:
      "I welcome thoughtful conversations about interpretable ML foundations, applied research partnerships, and student mentorship—reach out with context on your goals.",
    href: "/about#contact",
    secondaryHref: "/about#contact",
    secondaryLabel: "Schedule advisory chat",
    replyNote: "Typical reply: 48–72 hours",
  },
  seo: {
    title: "Home",
    description:
      "Portfolio home—placeholder copy until researcher-approved content is merged from the content packet.",
  },
};
