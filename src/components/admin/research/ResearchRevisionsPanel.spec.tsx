import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import ResearchRevisionsPanel from "./ResearchRevisionsPanel";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";

vi.mock("~/lib/api/endpoints/admin/research.api", () => ({
  adminResearchApi: {
    listRevisions: vi.fn(),
  },
}));

describe("ResearchRevisionsPanel", () => {
  beforeEach(() => {
    vi.mocked(adminResearchApi.listRevisions).mockResolvedValue([
      {
        id: "rev-2",
        entityType: "research_theme",
        entityId: "theme-1",
        snapshot: { title: "Second", publishStatus: "published" },
        createdAt: "2026-01-02T12:00:00.000Z",
      },
      {
        id: "rev-1",
        entityType: "research_theme",
        entityId: "theme-1",
        snapshot: { title: "First", publishStatus: "draft" },
        createdAt: "2026-01-01T12:00:00.000Z",
      },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders revision rows", async () => {
    render(() => (
      <ResearchRevisionsPanel themeId="theme-1" reloadKey={0} />
    ));
    expect(await screen.findByText("Second · published")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "View changes" }).length).toBe(2);
  });

  it("opens changes dialog with stored field values", async () => {
    render(() => (
      <ResearchRevisionsPanel themeId="theme-1" reloadKey={0} />
    ));
    const buttons = await screen.findAllByRole("button", { name: "View changes" });
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeTruthy();
    });
    expect(screen.getByText(/Changes at/)).toBeTruthy();
    expect(screen.getByText("Second")).toBeTruthy();
    expect(screen.getByText("published")).toBeTruthy();
  });
});
