import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminMessagesList from "./index";

const { list } = vi.hoisted(() => ({
  list: vi.fn(),
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("~/lib/api/endpoints/admin/messages.api", () => ({
  adminMessagesApi: { list },
}));

function renderList() {
  return render(() => (
    <MetaProvider>
      <AdminMessagesList />
    </MetaProvider>
  ));
}

describe("AdminMessagesList", () => {
  it("renders empty inbox state", async () => {
    list.mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 24, itemCount: 0, total: 0, totalPages: 0 },
    });
    renderList();
    expect(await screen.findByText("No messages yet")).toBeTruthy();
  });

  it("shows message row with link", async () => {
    list.mockResolvedValue({
      items: [
        {
          id: "00000000-0000-4000-8000-000000000099",
          senderName: "Ada Lovelace",
          senderEmail: "ada@example.com",
          category: "Collaboration",
          status: "new",
          isRead: false,
          submittedAt: "2026-01-01T12:00:00.000Z",
          bodySnippet: "Hello",
        },
      ],
      meta: { page: 1, limit: 24, itemCount: 1, total: 1, totalPages: 1 },
    });
    renderList();
    expect(await screen.findByText("Ada Lovelace")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /View message from Ada Lovelace/i }),
    ).toBeTruthy();
  });
});
