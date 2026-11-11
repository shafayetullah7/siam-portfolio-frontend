import { describe, expect, it } from "vitest";
import { homeContent } from "~/content";
import type { PublicHomePayload } from "../endpoints/public/site.api";
import { mapPublicHomeToContent } from "./mapPublicHomeToContent";

describe("mapPublicHomeToContent", () => {
  it("returns fallback when API is unpublished", () => {
    const api: PublicHomePayload = {
      published: false,
      visibleSectionIds: ["hero"],
      heroTitle: null,
      heroSubtitle: null,
      researchFocus: [],
    };
    const result = mapPublicHomeToContent(api, homeContent);
    expect(result).toBe(homeContent);
  });

  it("maps hero portrait when API includes url and alt", () => {
    const api: PublicHomePayload = {
      published: true,
      visibleSectionIds: ["hero"],
      heroTitle: "Ada",
      heroSubtitle: null,
      researchFocus: [],
      hero: {
        name: "Ada Lovelace",
        descriptor: "D",
        positioning: "P",
        primaryCta: { label: "R", href: "/research" },
        secondaryCta: { label: "C", href: "/contact" },
        portrait: { url: "https://cdn.example/portrait.jpg", alt: "Ada at desk" },
      },
    };
    const result = mapPublicHomeToContent(api, homeContent);
    expect(result.hero.portrait).toEqual({
      src: "https://cdn.example/portrait.jpg",
      alt: "Ada at desk",
    });
  });

  it("overrides hero when published", () => {
    const api: PublicHomePayload = {
      published: true,
      visibleSectionIds: ["hero"],
      heroTitle: "Legacy",
      heroSubtitle: null,
      researchFocus: [],
      hero: {
        name: "Ada Lovelace",
        descriptor: "Researcher",
        positioning: "Trustworthy ML.",
        primaryCta: { label: "Research", href: "/research" },
        secondaryCta: { label: "Contact", href: "/contact" },
      },
    };
    const result = mapPublicHomeToContent(api, homeContent);
    expect(result.hero.name).toBe("Ada Lovelace");
    expect(result.hero.descriptor).toBe("Researcher");
    expect(result.hero.portrait).toBeNull();
    expect(result.hero.ledger).toBeUndefined();
    expect(result.highlights).toBeUndefined();
    expect(result.cmsSectionIds).toEqual(["hero"]);
  });

  it("does not inherit static highlights when API omits them", () => {
    const api: PublicHomePayload = {
      published: true,
      visibleSectionIds: ["hero", "highlights"],
      heroTitle: "Live",
      heroSubtitle: null,
      researchFocus: [],
      hero: {
        name: "Live",
        descriptor: "D",
        positioning: "P",
        primaryCta: { label: "R", href: "/research" },
        secondaryCta: { label: "C", href: "/contact" },
      },
    };
    const result = mapPublicHomeToContent(api, homeContent);
    expect(result.highlights).toBeUndefined();
    expect(result.affiliation).toBeUndefined();
  });

  it("treatAsPublished maps preview payload", () => {
    const api: PublicHomePayload = {
      published: false,
      visibleSectionIds: ["hero", "researchFocus"],
      heroTitle: "Preview hero",
      heroSubtitle: null,
      researchFocus: [
        {
          title: "Theme",
          description: "Summary",
          href: "/research/t",
        },
      ],
      hero: {
        name: "Preview hero",
        descriptor: "Preview desc",
        positioning: "Line",
        primaryCta: { label: "R", href: "/research" },
        secondaryCta: { label: "C", href: "/contact" },
      },
    };
    const result = mapPublicHomeToContent(api, homeContent, {
      treatAsPublished: true,
    });
    expect(result.hero.name).toBe("Preview hero");
    expect(result.researchFocus).toHaveLength(1);
    expect(result.cmsSectionIds).toEqual(["hero", "researchFocus"]);
  });
});
