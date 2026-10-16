import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "~/lib/api/types";
import RouteErrorFallback from "./RouteErrorFallback";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: string }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

describe("RouteErrorFallback", () => {
  it("shows generic error copy and retry", () => {
    const reset = vi.fn();
    render(() => (
      <RouteErrorFallback error={new Error("Load failed")} reset={reset} />
    ));
    expect(screen.getByRole("heading", { name: /could not load/i })).toBeTruthy();
    expect(screen.getByText("Load failed")).toBeTruthy();
    screen.getByRole("button", { name: /try again/i }).click();
    expect(reset).toHaveBeenCalledOnce();
  });

  it("renders branded not-found for ApiError 404", () => {
    render(() => (
      <RouteErrorFallback
        error={new ApiError("Missing", 404)}
        reset={() => {}}
      />
    ));
    expect(screen.getByText("Page not found")).toBeTruthy();
    expect(screen.queryByText(/could not load/i)).toBeNull();
    expect(screen.getByRole("link", { name: "Home" })).toBeTruthy();
  });
});
