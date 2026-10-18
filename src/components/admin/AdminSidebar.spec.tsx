import { render, screen, within } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import AdminSidebar from "./AdminSidebar";

vi.mock("@solidjs/router", () => ({
  useLocation: () => ({ pathname: "/admin/pages", search: "", hash: "" }),
  useNavigate: () => vi.fn(),
  A: (props: {
    href: string;
    children?: JSX.Element;
    class?: string;
    "aria-current"?: "page";
  }) => (
    <a href={props.href} class={props.class} aria-current={props["aria-current"]}>
      {props.children}
    </a>
  ),
}));

vi.mock("~/lib/auth/AdminAuthProvider", () => ({
  useAdminAuth: () => ({
    admin: () => ({ firstName: "Dev", lastName: "Admin", userName: "dev_admin" }),
    status: () => "authenticated",
    bootstrap: vi.fn(),
    setFromLogin: vi.fn(),
    clear: vi.fn(),
  }),
}));

vi.mock("~/lib/api/endpoints/admin/auth.api", () => ({
  adminAuthApi: { logout: vi.fn() },
}));

describe("AdminSidebar", () => {
  it("renders section headings", () => {
    render(() => <AdminSidebar />);
    expect(screen.getByText("Overview")).toBeTruthy();
    expect(screen.getByText("Content")).toBeTruthy();
    expect(screen.getByText("Library & inbox")).toBeTruthy();
  });

  it("marks the active primary nav link", () => {
    render(() => <AdminSidebar />);
    const pages = screen.getByRole("link", { name: "Pages" });
    expect(pages.getAttribute("aria-current")).toBe("page");
  });

  it("shows coming soon rows without links", () => {
    render(() => <AdminSidebar />);
    const nav = screen.getByRole("navigation", { name: "Admin" });
    expect(within(nav).queryByRole("link", { name: "Home" })).toBeNull();
    expect(within(nav).getAllByText("Soon").length).toBeGreaterThan(0);
  });
});
