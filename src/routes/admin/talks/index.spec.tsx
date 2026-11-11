import { MetaProvider } from "@solidjs/meta";
import { Router, Route } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import TalksAdminLayout from "~/components/admin/talks/TalksAdminLayout";
import AdminTalksList from "./index";

const { list } = vi.hoisted(() => ({
  list: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/talks.api", () => ({
  adminTalksApi: { list },
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    A: (props: { href: string; children?: unknown; class?: string }) => (
      <a href={props.href} class={props.class}>
        {props.children}
      </a>
    ),
    Outlet: () => null,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: "/admin/talks" }),
  };
});

describe("AdminTalksList", () => {
  it("renders talks list tab", async () => {
    list.mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 24, itemCount: 0, total: 0, totalPages: 0 },
    });
    render(() => (
      <MetaProvider>
        <Router>
          <Route path="/" component={() => <AdminTalksList />} />
        </Router>
      </MetaProvider>
    ));
    expect(await screen.findByText("No talks yet")).toBeTruthy();
  });
});

describe("TalksAdminLayout", () => {
  it("shows collaborations tab link", () => {
    const { container } = render(() => (
      <MetaProvider>
        <Router>
          <Route path="/" component={TalksAdminLayout} />
        </Router>
      </MetaProvider>
    ));
    expect(container.textContent).toContain("Collaborations");
  });
});
