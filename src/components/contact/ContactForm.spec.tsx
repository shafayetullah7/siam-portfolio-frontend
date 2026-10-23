import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";

vi.mock("~/lib/api/endpoints/public/contact.api", () => ({
  contactPublicApi: {
    submit: vi.fn(),
  },
}));

import { contactPublicApi } from "~/lib/api/endpoints/public/contact.api";

const baseConfig = {
  formEnabled: true,
  intro: null,
  collaborationGuidance: null,
  responseTimeNote: null,
  categories: [] as string[],
  consentText: null,
  successMessage: null,
  publicEmail: null,
  showEmailOnPage: false,
  turnstileSiteKey: null,
};

describe("ContactForm", () => {
  it("keeps input values when client validation fails", async () => {
    render(() => <ContactForm config={baseConfig} />);
    const message = screen.getByLabelText(/^Message$/i);
    fireEvent.input(message, { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect((message as HTMLTextAreaElement).value).toBe("short");
    expect(contactPublicApi.submit).not.toHaveBeenCalled();
  });

  it("requires consent when consent text is configured", async () => {
    render(() => (
      <ContactForm
        config={{
          ...baseConfig,
          consentText: "I agree to be contacted.",
        }}
      />
    ));
    fireEvent.input(screen.getByLabelText(/^Name$/i), {
      target: { value: "Ada" },
    });
    fireEvent.input(screen.getByLabelText(/^Email$/i), {
      target: { value: "ada@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/^Message$/i), {
      target: { value: "Hello world message" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/must agree/i)).toBeTruthy();
    expect(contactPublicApi.submit).not.toHaveBeenCalled();
  });
});
