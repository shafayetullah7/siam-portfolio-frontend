import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import AdminAuthLayout from "./AdminAuthLayout";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element; class?: string }) => (
    <a href={props.href} class={props.class}>{props.children}</a>
  ),
}));

describe("AdminAuthLayout", () => {
  it("renders title, card content, and public site footer link", () => {
    render(() => (
      <AdminAuthLayout title="Admin sign in">
        <p>Form area</p>
      </AdminAuthLayout>
    ));

    expect(
      screen.getByRole("heading", { level: 1, name: "Admin sign in" }),
    ).toBeTruthy();
    expect(screen.getByText("Form area")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Public site" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "SIAM" }).getAttribute("href")).toBe("/");
  });
});
