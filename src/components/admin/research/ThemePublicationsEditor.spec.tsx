import { render } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import ThemePublicationsEditor from "./ThemePublicationsEditor";

vi.mock("~/lib/api/endpoints/admin/publications.api", () => ({
  adminPublicationsApi: {
    list: vi.fn().mockResolvedValue([]),
  },
}));

describe("ThemePublicationsEditor", () => {
  it("removes a linked publication", () => {
    const onChange = vi.fn();
    const { getByRole } = render(() => (
      <ThemePublicationsEditor
        links={[
          {
            id: "pub-1",
            slug: "paper-a",
            title: "Paper A",
            authorsShort: "Author",
            year: 2024,
            venue: "Venue",
            publishStatus: "published",
            sortOrder: 0,
          },
        ]}
        onChange={onChange}
        onDirty={vi.fn()}
      />
    ));
    getByRole("button", { name: "Remove" }).click();
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
