import { MetaProvider } from "@solidjs/meta";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminMessagesList from "./index";

const { list, bulkUpdate } = vi.hoisted(() => ({
  list: vi.fn(),
  bulkUpdate: vi.fn(),
}));

const { searchParams, setSearchParams } = vi.hoisted(() => ({
  searchParams: {} as Record<string, string>,
  setSearchParams: vi.fn((patch: Record<string, string | null>) => {
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === undefined) {
        delete searchParams[key];
      } else {
        searchParams[key] = value;
      }
    }
  }),
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [searchParams, setSearchParams],
  };
});

vi.mock("~/lib/api/endpoints/admin/messages.api", () => ({
  adminMessagesApi: { list, bulkUpdate },
}));

function renderList() {
  return render(() => (
    <MetaProvider>
      <AdminMessagesList />
    </MetaProvider>
  ));
}

const emptyMeta = {
  page: 1,
  limit: 24,
  itemCount: 0,
  total: 0,
  totalPages: 0,
};

describe("AdminMessagesList", () => {
  it("passes status query param to list API on inbox view", async () => {
    Object.keys(searchParams).forEach((k) => delete searchParams[k]);
    searchParams.status = "new";
    list.mockResolvedValue({ items: [], meta: emptyMeta });
    renderList();
    await screen.findByText("No messages yet");
    expect(list).toHaveBeenCalledWith(
      expect.objectContaining({ status: "new" }),
    );
  });

  it("maps folder=spam in URL to list API", async () => {
    Object.keys(searchParams).forEach((k) => delete searchParams[k]);
    searchParams.folder = "spam";
    list.mockResolvedValue({ items: [], meta: emptyMeta });
    renderList();
    await screen.findByText("No spam");
    expect(list).toHaveBeenCalledWith(
      expect.objectContaining({ status: "spam" }),
    );
  });

  it("renders empty inbox state", async () => {
    Object.keys(searchParams).forEach((k) => delete searchParams[k]);
    list.mockResolvedValue({ items: [], meta: emptyMeta });
    renderList();
    expect(await screen.findByText("No messages yet")).toBeTruthy();
  });

  it("shows message row with link", async () => {
    Object.keys(searchParams).forEach((k) => delete searchParams[k]);
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

  it("calls bulk update when marking selected as read", async () => {
    Object.keys(searchParams).forEach((k) => delete searchParams[k]);
    const id = "00000000-0000-4000-8000-000000000099";
    list.mockResolvedValue({
      items: [
        {
          id,
          senderName: "Ada",
          senderEmail: "ada@example.com",
          category: null,
          status: "new",
          isRead: false,
          submittedAt: "2026-01-01T12:00:00.000Z",
          bodySnippet: "Hi",
        },
      ],
      meta: { page: 1, limit: 24, itemCount: 1, total: 1, totalPages: 1 },
    });
    bulkUpdate.mockResolvedValue({ updated: 1 });
    renderList();
    await screen.findByText("Ada");
    fireEvent.click(screen.getByRole("checkbox", { name: /Select message/i }));
    fireEvent.click(screen.getByRole("button", { name: "Mark read" }));
    expect(bulkUpdate).toHaveBeenCalledWith({
      ids: [id],
      patch: { isRead: true },
    });
  });
});
