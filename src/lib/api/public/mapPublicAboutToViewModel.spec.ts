import { describe, expect, it } from "vitest";
import type { PublicAboutPayload } from "../endpoints/public/site.api";
import { mapPublicAboutToViewModel } from "./mapPublicAboutToViewModel";

describe("mapPublicAboutToViewModel", () => {
  it("returns empty shell when unpublished", () => {
    const api: PublicAboutPayload = {
      published: false,
      headline: "Hidden",
      shortBio: "Bio",
      longBio: null,
      affiliation: null,
    };
    const view = mapPublicAboutToViewModel(api);
    expect(view.published).toBe(false);
    expect(view.showIntro).toBe(false);
    expect(view.title).toBe("");
  });

  it("sets section flags from published payload", () => {
    const api: PublicAboutPayload = {
      published: true,
      headline: null,
      shortBio: "Short bio",
      longBio: null,
      affiliation: null,
      displayName: "Ada Lovelace",
      professionalTitle: "Researcher",
      researchStatement: "Why ML",
      expertise: {
        domains: ["ML"],
        methodologies: [],
        tooling: [],
        practices: [],
      },
      scholarlyProfiles: [{ label: "ORCID", href: "https://orcid.org/x" }],
      collaborationInterests: "Partnerships welcome",
      contactEmail: "ada@lab.edu",
    };
    const view = mapPublicAboutToViewModel(api);
    expect(view.title).toBe("Ada Lovelace");
    expect(view.showStatement).toBe(true);
    expect(view.showExpertise).toBe(true);
    expect(view.showScholarly).toBe(true);
    expect(view.showCollaboration).toBe(true);
  });
});
