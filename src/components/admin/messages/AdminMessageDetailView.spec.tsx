import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminMessageDetailView from "./AdminMessageDetailView";
import type { ContactMessageAdmin } from "~/lib/api/types/contact.types";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: unknown }) => (
    <a href={props.href}>{props.children}</a>
  ),
  useNavigate: () => vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/messages.api", () => ({
  adminMessagesApi: {
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const sampleMessage: ContactMessageAdmin = {
  id: "00000000-0000-4000-8000-000000000099",
  status: "new",
  isRead: false,
  category: "Collaboration",
  senderName: "Ada Lovelace",
  senderEmail: "ada@example.com",
  affiliation: "Lab",
  subject: null,
  body: "Hello from the contact form.",
  consentGiven: true,
  consentTextVersion: "v1",
  submittedAt: "2026-01-01T12:00:00.000Z",
  readAt: null,
  repliedAt: null,
  archivedAt: null,
  adminNotes: null,
  metadata: { ip: "127.0.0.1" },
  createdAt: "2026-01-01T12:00:00.000Z",
  updatedAt: "2026-01-01T12:00:00.000Z",
};

describe("AdminMessageDetailView", () => {
  it("renders message body", () => {
    render(() => (
      <AdminMessageDetailView
        message={sampleMessage}
        onUpdated={vi.fn()}
      />
    ));
    expect(screen.getByText("Hello from the contact form.")).toBeTruthy();
  });

  it("exposes delete control", () => {
    render(() => (
      <AdminMessageDetailView
        message={sampleMessage}
        onUpdated={vi.fn()}
      />
    ));
    expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
  });
});
