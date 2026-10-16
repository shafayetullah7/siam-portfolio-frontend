import type { ProjectRecord } from "./catalog.types";

/** PLACEHOLDER — replace from docs/content-packet/projects/ */
export const projectsCatalog: readonly ProjectRecord[] = [
  {
    slug: "example-open-source-project",
    title: "Example open-source project (placeholder)",
    summary:
      "Problem, approach, and outcome in two sentences. Not a real project until content-packet approval.",
    href: "https://github.com/",
    tags: ["Python", "ML", "Prototype"],
    featuredOnHome: true,
    body:
      "Stub detail body for the project page. Describe responsibilities, evaluation, and limitations when copy is ready.",
  },
  {
    slug: "second-example-project",
    title: "Second example project (placeholder)",
    summary: "Another featured system for the home grid.",
    href: "https://github.com/",
    tags: ["JAX", "Research code"],
    featuredOnHome: true,
    body: "Second project stub for detail route testing.",
  },
  {
    slug: "coursework-prototype",
    title: "Coursework prototype (index only)",
    summary: "Shown on /projects but not featured on home.",
    href: "https://github.com/",
    tags: ["Coursework"],
    featuredOnHome: false,
    body: "Optional coursework artifact; not featured on the landing page.",
  },
];
