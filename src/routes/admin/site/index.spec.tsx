import { MetaProvider } from "@solidjs/meta";
import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminSiteSettings from "./index";

const { getSettings, listNav, listPages, updateSettings, saveSiteSettingsPanel } =
  vi.hoisted(() => ({
    getSettings: vi.fn(),
    listNav: vi.fn(),
    listPages: vi.fn(),
    updateSettings: vi.fn(),
    saveSiteSettingsPanel: vi.fn(),
  }));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    A: (props: { href: string; children?: unknown }) => (
      <a href={props.href}>{props.children}</a>
    ),
    useSubmission: () => ({
      pending: false,
      result: undefined,
      error: undefined,
    }),
  };
});

vi.mock("~/lib/admin/site/saveSiteSettingsPanel", () => ({
  saveSiteSettingsPanel: (...args: unknown[]) => saveSiteSettingsPanel(...args),
  revalidateAfterSiteSettingsSave: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/site.api", () => ({
  adminSiteApi: {
    getSettings,
    listNav,
    updateSettings,
    upsertNav: vi.fn(),
  },
}));

vi.mock("~/lib/api/endpoints/admin/pages.api", () => ({
  adminPagesApi: {
    list: listPages,
  },
}));

vi.mock("~/components/admin/media/MediaPicker", () => ({
  default: () => null,
}));

vi.mock("~/lib/forms/actions/admin-site.actions", () => ({
  addNavItemAction: vi.fn(),
  saveNavRowAction: { with: () => "/mock" },
  saveSiteSettingsAction: vi.fn(),
}));

const baseSettings = {
  siteName: "SIAM Dev",
  defaultMetaDescription: null,
  footerText: null,
  researchHubIntro: null,
  projectsHubIntro: null,
  writingHubIntro: null,
  talksHubIntro: null,
  collaborationsPageIntro: null,
  collaborationsPageEnabled: false,
  achievementsHubIntro: null,
  experienceHubIntro: null,
  contactFormEnabled: true,
  contactPageIntro: null,
  contactCollaborationGuidance: null,
  contactResponseTimeNote: null,
  contactCategories: ["Collaboration"],
  contactConsentText: null,
  contactSuccessMessage: null,
  contactPublicEmail: null,
  contactShowEmailOnPage: false,
  faviconUrl: null,
  faviconMediaId: null,
};

describe("AdminSiteSettings", () => {
  it("renders tabs and global form after load", async () => {
    getSettings.mockResolvedValue(baseSettings);
    listNav.mockResolvedValue([]);
    listPages.mockResolvedValue([]);
    updateSettings.mockResolvedValue(baseSettings);

    render(() => (
      <MetaProvider>
        <AdminSiteSettings />
      </MetaProvider>
    ));

    expect(
      await screen.findByRole("tab", { name: "Global" }),
    ).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Page intros" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Contact" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Navigation" })).toBeTruthy();
    expect(screen.getByText(/What lives where/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save global settings" })).toBeTruthy();
  });

  it("saves global tab via patch API", async () => {
    getSettings.mockResolvedValue(baseSettings);
    listNav.mockResolvedValue([]);
    listPages.mockResolvedValue([]);
    saveSiteSettingsPanel.mockResolvedValue({ ok: true });

    render(() => (
      <MetaProvider>
        <AdminSiteSettings />
      </MetaProvider>
    ));

    const nameInput = await screen.findByDisplayValue("SIAM Dev");
    fireEvent.input(nameInput, { target: { value: "Updated" } });
    fireEvent.click(screen.getByRole("button", { name: "Save global settings" }));

    await waitFor(() => {
      expect(saveSiteSettingsPanel).toHaveBeenCalledWith(
        "global",
        expect.objectContaining({ siteName: "Updated" }),
      );
    });
    expect(await screen.findByText("Global settings saved.")).toBeTruthy();
  });
});
