import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationEditorForm from "./PublicationEditorForm";

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

vi.mock("~/lib/forms/actions/admin-publications.actions", () => ({
  savePublicationAction: Object.assign(vi.fn(), {
    with: (id: string) => `/actions/save-publication/${id}`,
  }),
}));

async function goToReviewStep() {
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
}

describe("PublicationEditorForm", () => {
  it("blocks save on review when basics are incomplete", async () => {
    render(() => <PublicationEditorForm />);
    await goToReviewStep();

    expect(screen.getByText(/Complete all required fields on/i)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Save draft" }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("posts draft JSON to the save action when valid", async () => {
    render(() => <PublicationEditorForm />);

    fireEvent.input(document.querySelector('input[name="title"]')!, {
      target: { value: "My Paper" },
    });
    fireEvent.input(document.querySelector('input[name="author-name-0"]')!, {
      target: { value: "Author A" },
    });
    fireEvent.input(document.querySelector('input[name="venue"]')!, {
      target: { value: "NeurIPS" },
    });

    await goToReviewStep();

    const form = document.getElementById(
      "publication-wizard-form",
    ) as HTMLFormElement;
    expect(form.getAttribute("action")).toBe("/actions/save-publication/new");

    const hidden = form.querySelector(
      'input[name="publicationDraftJson"]',
    ) as HTMLInputElement;
    const payload = JSON.parse(hidden.value) as { title: string; slug: string };
    expect(payload.title).toBe("My Paper");
    expect(payload.slug).toBe("my-paper");
  });
});
