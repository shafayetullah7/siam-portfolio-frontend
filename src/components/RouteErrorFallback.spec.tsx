import { render, screen } from "@solidjs/testing-library";
import type { JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import RouteErrorFallback from "./RouteErrorFallback";

vi.mock("@solidjs/router", () => ({
  A: (props: { href: string; children?: JSX.Element }) => (
    <a href={props.href}>{props.children}</a>
  ),
}));

describe("RouteErrorFallback", () => {
  it("embedded variant does not render main#main", () => {
    render(() => (
      <RouteErrorFallback
        error={new Error("test")}
        reset={() => {}}
        variant="embedded"
      />
    ));
    expect(document.getElementById("main")).toBeNull();
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("standalone variant does not use main#main", () => {
    render(() => (
      <RouteErrorFallback
        error={new Error("test")}
        reset={() => {}}
        variant="standalone"
      />
    ));
    expect(document.getElementById("main")).toBeNull();
  });
});
