import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import ResearchThemeCreateWizard from "./ResearchThemeCreateWizard";

vi.mock("@solidjs/router", async () => {
  const actual = await vi.importActual<typeof import("@solidjs/router")>(
    "@solidjs/router",
  );
  return {
    ...actual,
    useSubmission: () => ({ result: undefined, error: undefined, pending: false }),
    A: (props: { href: string; children?: unknown }) => (
      <a href={props.href}>{props.children}</a>
    ),
  };
});

vi.mock("~/components/admin/media/MediaPicker", () => ({
  default: () => null,
}));

vi.mock("~/lib/api/endpoints/admin/research.api", () => ({
  adminResearchApi: {
    get: vi.fn().mockResolvedValue({
      id: "theme-1",
      slug: "my-theme",
      title: "My Theme",
      summary: "Summary",
      themeStatus: "ongoing",
      problem: "Problem",
      objectives: "Goals",
      tags: null,
      publishStatus: "draft",
      sortOrder: 0,
      featuredOnHome: false,
      resources: [],
      updatedAt: "2026-10-01T00:00:00Z",
    }),
    getPublications: vi.fn().mockResolvedValue([]),
    getProjects: vi.fn().mockResolvedValue([]),
  },
}));

describe("ResearchThemeCreateWizard", () => {
  it("allows jumping to any step from the progress bar", () => {
    render(() => <ResearchThemeCreateWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Story/i }));
    expect(screen.getByRole("heading", { name: "Story" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Review/i }));
    expect(screen.getByRole("heading", { name: "Review & save" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /More/i })).toBeNull();
  });

  it("disables save on review until required fields are filled", () => {
    render(() => <ResearchThemeCreateWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Review/i }));
    const save = screen.getByRole("button", { name: "Save draft" });
    expect(save.hasAttribute("disabled")).toBe(true);
  });

  it("shows story step after basics", () => {
    render(() => <ResearchThemeCreateWizard />);
    const titleInput = document.querySelector(
      'input[name="title"]',
    ) as HTMLInputElement;
    const summaryInput = document.querySelector(
      'textarea[name="summary"]',
    ) as HTMLTextAreaElement;
    fireEvent.input(titleInput, { target: { value: "My Theme" } });
    fireEvent.input(summaryInput, { target: { value: "A short summary." } });
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "Story" })).toBeTruthy();
  });
});

describe("ResearchThemeCreateWizard edit", () => {
  it("shows four steps and save only on More", async () => {
    render(() => <ResearchThemeCreateWizard themeId="theme-1" />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /More/i })).toBeTruthy();
    });
    fireEvent.click(screen.getByRole("button", { name: /Review/i }));
    expect(screen.getByRole("heading", { name: "Review" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Save changes" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /More/i }));
    expect(screen.getByRole("heading", { name: "More" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeTruthy();
  });
});
