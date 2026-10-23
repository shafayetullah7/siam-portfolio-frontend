import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminHome from "./index";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: unknown }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/api", () => ({
  adminClient: {
    get: vi.fn().mockResolvedValue({
      pages: { draft: 0, published: 1, scheduled: 0, archived: 0 },
      publications: { draft: 0, published: 0, scheduled: 0, archived: 0 },
      projects: { draft: 0, published: 0, scheduled: 0, archived: 0 },
      writing: { draft: 0, published: 0, scheduled: 0, archived: 0 },
      timeline: { draft: 0, published: 0, scheduled: 0, archived: 0 },
      media: 0,
      inbox: { unread: 4, new: 2, formEnabled: true },
    }),
  },
}));

describe("AdminHome", () => {
  it("links messages card to filtered inbox", async () => {
    render(() => (
      <MetaProvider>
        <AdminHome />
      </MetaProvider>
    ));
    expect(await screen.findByText("4")).toBeTruthy();
    const link = screen.getByRole("link", { name: /Unread messages/i });
    expect(link.getAttribute("href")).toBe("/admin/messages?status=new");
  });
});
