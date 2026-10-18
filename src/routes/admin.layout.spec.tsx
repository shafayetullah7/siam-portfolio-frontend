import { render, screen, within } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { AdminAuthStatus } from "~/lib/auth/admin-auth.types";
import { AdminLayoutContent } from "./admin";

const authState = vi.hoisted(() => ({
  status: "unknown" as AdminAuthStatus,
}));

vi.mock("~/lib/api/queries/admin", () => ({
  getAdminSession: async () => null,
}));

vi.mock("@solidjs/router", () => ({
  useLocation: () => ({ pathname: "/admin/pages", search: "", hash: "" }),
  useNavigate: () => vi.fn(),
  query: <T,>(fn: () => T) => fn,
  createAsync: <T,>(fn: () => T) => fn,
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

vi.mock("~/lib/auth/AdminAuthProvider", () => ({
  useAdminAuth: () => ({
    status: () => authState.status,
    admin: () =>
      authState.status === "authenticated"
        ? { firstName: "Dev", lastName: "Admin", userName: "dev_admin" }
        : null,
    bootstrap: vi.fn(),
    setFromLogin: vi.fn(),
    clear: vi.fn(),
  }),
}));

vi.mock("~/lib/api/endpoints/admin/auth.api", () => ({
  adminAuthApi: { logout: vi.fn() },
}));

vi.mock("~/components/AsyncRouteShell", () => ({
  default: (props: { children: JSX.Element }) => (
    <div data-testid="route-shell">{props.children}</div>
  ),
}));

describe("AdminLayoutContent session loading", () => {
  it("renders compact loading inside main#main while status is unknown", () => {
    authState.status = "unknown";
    render(() => (
      <AdminLayoutContent
        params={{}}
        location={{ pathname: "/admin/pages", search: "", hash: "", query: {}, state: {}, key: "t" }}
        data={undefined}
      >
        <p>Protected</p>
      </AdminLayoutContent>
    ));

    const main = document.getElementById("main");
    expect(main).toBeTruthy();
    expect(main?.querySelector('[role="status"]')).toBeTruthy();
    expect(screen.queryByTestId("route-shell")).toBeNull();
    expect(screen.queryByText("Protected")).toBeNull();
  });

  it("renders admin nav outside main when authenticated", () => {
    authState.status = "authenticated";
    render(() => (
      <AdminLayoutContent
        params={{}}
        location={{ pathname: "/admin/pages", search: "", hash: "", query: {}, state: {}, key: "t2" }}
        data={undefined}
      >
        <p>Protected</p>
      </AdminLayoutContent>
    ));

    const main = document.getElementById("main");
    const adminNav = screen.getByRole("navigation", { name: "Admin" });
    expect(main).toBeTruthy();
    expect(adminNav).toBeTruthy();
    expect(main?.contains(adminNav)).toBe(false);
    expect(screen.getByText("Protected")).toBeTruthy();
    const activeLinks = within(adminNav).getAllByRole("link");
    expect(activeLinks.length).toBeGreaterThanOrEqual(3);
  });
});
