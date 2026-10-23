import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationSupplementsEditor from "./PublicationSupplementsEditor";

describe("PublicationSupplementsEditor", () => {
  it("adds a supplement row", () => {
    const onChange = vi.fn();
    render(() => (
      <PublicationSupplementsEditor
        supplements={[]}
        onDirty={vi.fn()}
        onChange={onChange}
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "Add supplement" }));
    expect(onChange).toHaveBeenCalledWith([
      { label: "", url: "", kind: "other" },
    ]);
  });
});
