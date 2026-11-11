import { MetaProvider } from "@solidjs/meta";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import type { HomeAdminAggregate } from "~/lib/api/types/home.types";
import AdminHomeEditor from "./index";

const { getAggregate, updateHome, updateProfile, featuredSummary } = vi.hoisted(() => ({
  getAggregate: vi.fn(),
  updateHome: vi.fn(),
  updateProfile: vi.fn(),
  featuredSummary: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/home.api", () => ({
  adminHomeApi: {
    getAggregate,
    update: updateHome,
    getPublishCheck: vi.fn().mockResolvedValue({ errors: [], warnings: [] }),
    publish: vi.fn(),
    unpublish: vi.fn(),
    preview: vi.fn(),
    featuredSummary,
  },
}));

vi.mock("~/components/admin/media/MediaPicker", () => ({
  default: () => null,
}));

vi.mock("~/lib/api/endpoints/admin/media.api", () => ({
  adminMediaApi: {
    get: vi.fn().mockResolvedValue({ url: "https://cdn/x.jpg", alt: "Alt" }),
  },
}));

vi.mock("~/lib/api/endpoints/admin/profile.api", () => ({
  adminProfileApi: {
    update: updateProfile,
    getPublishCheck: vi.fn().mockResolvedValue({ errors: [], warnings: [] }),
    publish: vi.fn(),
    unpublish: vi.fn(),
  },
}));

const baseTimestamps = {
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  publishedAt: null,
  scheduledAt: null,
  archivedAt: null,
};

const fixture: HomeAdminAggregate = {
  profile: {
    id: "p1",
    headline: "Headline",
    displayName: "Ada Lovelace",
    professionalTitle: "Researcher",
    contactEmail: "ada@example.com",
    shortBio: null,
    longBio: null,
    affiliation: null,
    affiliationRole: null,
    affiliationOrganization: null,
    affiliationLocation: null,
    portraitMediaId: null,
    scholarlyProfiles: [],
    researchStatement: null,
    expertise: null,
    collaborationInterests: null,
    publishStatus: "draft",
    ...baseTimestamps,
  },
  homepage: {
    id: "h1",
    heroTitle: "Welcome",
    heroSubtitle: "Sub",
    heroDescriptor: null,
    heroPositioning: null,
    statusBadge: null,
    primaryCtaLabel: "Read",
    primaryCtaHref: "/writing",
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    heroMediaId: null,
    sections: [
      { id: "hero", visible: true },
      { id: "researchFocus", visible: true },
    ],
    highlights: null,
    currentlyWorkingOn: null,
    collaborationCta: null,
    profiles: null,
    seoTitle: null,
    seoDescription: null,
    publishStatus: "draft",
    ...baseTimestamps,
  },
};

function renderEditor() {
  return render(() => (
    <MetaProvider>
      <AdminHomeEditor />
    </MetaProvider>
  ));
}

describe("AdminHomeEditor", () => {
  it("renders composition tab from aggregate", async () => {
    getAggregate.mockResolvedValue(fixture);
    featuredSummary.mockResolvedValue({
      caps: { research: 6, publications: 4, projects: 3 },
      research: [],
      publications: [],
      projects: [],
    });
    renderEditor();
    await screen.findByRole("button", { name: "Composition" });
    expect(screen.getByRole("button", { name: "Identity" })).toBeDefined();
    const titleInput = await screen.findByDisplayValue("Welcome");
    expect(titleInput).toBeDefined();
    expect(screen.getByRole("heading", { name: "Featured on home" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Choose image from library" }),
    ).toBeTruthy();
  });

  it("saves composition via adminHomeApi.update", async () => {
    getAggregate.mockResolvedValue(fixture);
    featuredSummary.mockResolvedValue({
      caps: { research: 6, publications: 4, projects: 3 },
      research: [],
      publications: [],
      projects: [],
    });
    updateHome.mockResolvedValue({
      ...fixture.homepage,
      heroTitle: "New title",
    });
    renderEditor();
    const titleInput = await screen.findByDisplayValue("Welcome");
    fireEvent.input(titleInput, { target: { value: "New title" } });
    fireEvent.click(screen.getByRole("button", { name: "Save composition" }));
    await screen.findByText("Composition saved.");
    expect(updateHome).toHaveBeenCalledWith(
      expect.objectContaining({
        heroTitle: "New title",
        sections: expect.any(Array),
      }),
    );
  });

  it("saves identity via adminProfileApi.update", async () => {
    getAggregate.mockResolvedValue(fixture);
    featuredSummary.mockResolvedValue({
      caps: { research: 6, publications: 4, projects: 3 },
      research: [],
      publications: [],
      projects: [],
    });
    updateProfile.mockResolvedValue({
      ...fixture.profile,
      displayName: "Grace Hopper",
    });
    renderEditor();
    await screen.findByDisplayValue("Welcome");
    fireEvent.click(screen.getByRole("button", { name: "Identity" }));
    const nameInput = await screen.findByDisplayValue("Ada Lovelace");
    fireEvent.input(nameInput, { target: { value: "Grace Hopper" } });
    fireEvent.click(screen.getByRole("button", { name: "Save identity" }));
    await screen.findByText("Identity saved.");
    expect(updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ displayName: "Grace Hopper" }),
    );
  });

  it("shows error when composition save fails", async () => {
    getAggregate.mockResolvedValue(fixture);
    featuredSummary.mockResolvedValue({
      caps: { research: 6, publications: 4, projects: 3 },
      research: [],
      publications: [],
      projects: [],
    });
    const { ApiError } = await import("~/lib/api/types");
    updateHome.mockRejectedValue(new ApiError("Validation failed", 400));
    renderEditor();
    await screen.findByDisplayValue("Welcome");
    fireEvent.click(screen.getByRole("button", { name: "Save composition" }));
    await screen.findByText("Validation failed");
  });
});
