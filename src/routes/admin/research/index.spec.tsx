import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminResearchList from "./index";

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    A: (props: { href: string; children?: unknown; class?: string }) => (
      <a href={props.href} class={props.class}>{props.children}</a>
    ),
    useNavigate: () => vi.fn(),
    revalidate: vi.fn(),
  };
});

vi.mock("~/lib/api/endpoints/admin/research.api", () => ({
  adminResearchApi: {
    list: vi.fn().mockResolvedValue([]),
  },
}));

describe("AdminResearchList", () => {
  it("renders empty list state with new theme CTA", async () => {
    render(() => <AdminResearchList />);
    expect(await screen.findByText("No research themes yet")).toBeTruthy();
    expect(screen.getByRole("link", { name: "New theme" })).toBeTruthy();
  });
});
