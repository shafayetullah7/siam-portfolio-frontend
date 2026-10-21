import { fireEvent, render, screen } from "@solidjs/testing-library";
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

describe("ResearchThemeCreateWizard", () => {
  it("disables Next until basics are valid", () => {
    render(() => <ResearchThemeCreateWizard />);
    const next = screen.getByRole("button", { name: "Next" });
    expect(next.hasAttribute("disabled")).toBe(true);

    const titleInput = document.querySelector(
      'input[name="title"]',
    ) as HTMLInputElement;
    const summaryInput = document.querySelector(
      'textarea[name="summary"]',
    ) as HTMLTextAreaElement;
    fireEvent.input(titleInput, { target: { value: "My Theme" } });
    fireEvent.input(summaryInput, { target: { value: "A short summary." } });
    expect(next.hasAttribute("disabled")).toBe(false);
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
