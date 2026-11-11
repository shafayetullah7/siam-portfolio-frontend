import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach } from "vitest";

const { putRelations } = vi.hoisted(() => ({
  putRelations: vi.fn().mockResolvedValue({
    relations: {
      publicationIds: [],
      projectIds: [],
      themeIds: [],
    },
  }),
}));

import TalkRelationsPanel from "./TalkRelationsPanel";

vi.mock("@solidjs/router", () => ({
  revalidate: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/talks.api", () => ({
  adminTalksApi: { putRelations },
}));

vi.mock("~/lib/api/endpoints/admin/publications.api", () => ({
  adminPublicationsApi: { list: vi.fn().mockResolvedValue([]) },
}));

vi.mock("~/lib/api/endpoints/admin/projects.api", () => ({
  adminProjectsApi: { list: vi.fn().mockResolvedValue([]) },
}));

vi.mock("~/lib/api/endpoints/admin/research.api", () => ({
  adminResearchApi: { list: vi.fn().mockResolvedValue([]) },
}));

vi.mock("~/lib/api/queries/public", () => ({
  getPublicTalks: { key: "public-talks" },
  getPublicTalkBySlug: { keyFor: (slug: string) => `public-talks-slug:${slug}` },
  getPublicResearchThemes: { keyFor: () => "public-research-themes" },
  getPublicResearchTheme: {
    keyFor: (slug: string) => `public-research-theme:${slug}`,
  },
}));

describe("TalkRelationsPanel", () => {
  beforeEach(() => {
    putRelations.mockClear();
  });

  it("renders relation sections", () => {
    render(() => (
      <TalkRelationsPanel
        talkId="talk-1"
        slug="my-talk"
        relations={{ publicationIds: [], projectIds: [], themeIds: [] }}
      />
    ));

    expect(screen.getByRole("heading", { name: "Related outputs" })).toBeTruthy();
    expect(screen.getByText("Publications")).toBeTruthy();
    expect(screen.getByText("Projects")).toBeTruthy();
    expect(screen.getByText("Research themes")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Save relations" }).hasAttribute("disabled"),
    ).toBe(true);
  });
});
