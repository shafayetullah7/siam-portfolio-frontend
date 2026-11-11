import { MetaProvider } from "@solidjs/meta";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import AdminHomePreview from "./preview";

const { preview } = vi.hoisted(() => ({
  preview: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/home.api", () => ({
  adminHomeApi: { preview },
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    A: (props: { href: string; children?: unknown }) => (
      <a href={props.href}>{props.children as never}</a>
    ),
  };
});

describe("AdminHomePreview", () => {
  it("renders draft banner and back link", async () => {
    preview.mockResolvedValue({
      published: false,
      visibleSectionIds: ["hero"],
      heroTitle: "Test",
      heroSubtitle: null,
      researchFocus: [],
    });
    render(() => (
      <MetaProvider>
        <AdminHomePreview />
      </MetaProvider>
    ));
    expect(await screen.findByText(/Preview — draft homepage/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to editor" })).toBeTruthy();
  });
});
