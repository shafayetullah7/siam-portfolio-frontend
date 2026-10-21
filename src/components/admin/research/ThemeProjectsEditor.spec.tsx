import { render } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import ThemeProjectsEditor from "./ThemeProjectsEditor";

vi.mock("~/lib/api/endpoints/admin/projects.api", () => ({
  adminProjectsApi: {
    list: vi.fn().mockResolvedValue([]),
  },
}));

describe("ThemeProjectsEditor", () => {
  it("removes a linked project", () => {
    const onChange = vi.fn();
    const { getByRole } = render(() => (
      <ThemeProjectsEditor
        links={[
          {
            id: "proj-1",
            slug: "project-a",
            title: "Project A",
            summary: "Summary",
            tags: null,
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
