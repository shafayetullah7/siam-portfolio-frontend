import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import ResearchRevisionsPanel from "./ResearchRevisionsPanel";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";

vi.mock("~/lib/api/endpoints/admin/research.api", () => ({
  adminResearchApi: {
    listRevisions: vi.fn(),
    restoreRevision: vi.fn(),
  },
}));

describe("ResearchRevisionsPanel", () => {
  beforeEach(() => {
    vi.mocked(adminResearchApi.listRevisions).mockResolvedValue([
      {
        id: "rev-1",
        entityType: "research_theme",
        entityId: "theme-1",
        snapshot: { title: "First", publishStatus: "draft" },
        createdAt: "2026-01-01T12:00:00.000Z",
      },
      {
        id: "rev-2",
        entityType: "research_theme",
        entityId: "theme-1",
        snapshot: { title: "Second", publishStatus: "draft" },
        createdAt: "2026-01-02T12:00:00.000Z",
      },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders revision rows from list API", async () => {
    render(() => (
      <ResearchRevisionsPanel
        themeId="theme-1"
        reloadKey={0}
        onRestored={() => {}}
      />
    ));
    expect(await screen.findByText("First · draft")).toBeTruthy();
    expect(screen.getByText("Second · draft")).toBeTruthy();
  });

  it("calls restore when confirm accepts", async () => {
    const confirmMock = vi.fn(() => true);
    vi.stubGlobal("confirm", confirmMock);
    const onRestored = vi.fn();
    vi.mocked(adminResearchApi.restoreRevision).mockResolvedValue({
      id: "theme-1",
      slug: "s",
      title: "Restored",
      summary: "S",
      themeStatus: "ongoing",
      problem: "",
      publishStatus: "draft",
      publishedAt: null,
      scheduledAt: null,
      archivedAt: null,
      sortOrder: 0,
      featuredOnHome: false,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
      resources: [],
    });

    render(() => (
      <ResearchRevisionsPanel
        themeId="theme-1"
        reloadKey={0}
        onRestored={onRestored}
      />
    ));
    const buttons = await screen.findAllByRole("button", { name: "Restore" });
    buttons[0].click();
    await vi.waitFor(() => {
      expect(adminResearchApi.restoreRevision).toHaveBeenCalledWith(
        "theme-1",
        "rev-1",
      );
      expect(onRestored).toHaveBeenCalled();
    });
    expect(confirmMock).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
