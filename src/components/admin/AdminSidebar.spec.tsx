import { render, screen } from "@solidjs/testing-library";
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
    "aria-current"?: string;
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
  it("marks the active primary nav link", () => {
    render(() => <AdminSidebar />);
    const pages = screen.getByRole("link", { name: "Pages" });
    expect(pages.getAttribute("aria-current")).toBe("page");
  });
});
