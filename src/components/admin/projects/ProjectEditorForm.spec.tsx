import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import ProjectEditorForm from "./ProjectEditorForm";

vi.mock("@solidjs/router", async () => {
  const actual = await vi.importActual<typeof import("@solidjs/router")>(
    "@solidjs/router",
  );
  return {
    ...actual,
    useSubmission: () => ({
      pending: false,
      result: undefined,
      error: undefined,
    }),
    A: (props: { href: string; children?: unknown }) => (
      <a href={props.href}>{props.children}</a>
    ),
  };
});

vi.mock("~/lib/forms/actions/admin-projects.actions", () => ({
  saveProjectAction: Object.assign(vi.fn(), {
    with: (id: string) => `/actions/save-project/${id}`,
  }),
}));

async function goToReviewStep() {
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
}

describe("ProjectEditorForm", () => {
  it("blocks save on review when basics are incomplete", async () => {
    render(() => <ProjectEditorForm />);
    await goToReviewStep();

    expect(screen.getByText(/Complete all required fields on/i)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Save draft" }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("posts draft JSON to the save action when valid", async () => {
    render(() => <ProjectEditorForm />);

    fireEvent.input(document.querySelector('input[name="title"]')!, {
      target: { value: "My Project" },
    });
    fireEvent.input(document.querySelector('textarea[name="summary"]')!, {
      target: { value: "A short summary." },
    });

    await goToReviewStep();

    const form = document.getElementById(
      "project-wizard-form",
    ) as HTMLFormElement;
    expect(form.getAttribute("action")).toBe("/actions/save-project/new");

    const hidden = form.querySelector(
      'input[name="projectDraftJson"]',
    ) as HTMLInputElement;
    const payload = JSON.parse(hidden.value) as { title: string; slug: string };
    expect(payload.title).toBe("My Project");
    expect(payload.slug).toBe("my-project");
  });
});
