import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationAuthorsEditor from "./PublicationAuthorsEditor";

describe("PublicationAuthorsEditor", () => {
  it("reorders authors with Up/Down", () => {
    const onChange = vi.fn();
    render(() => (
      <PublicationAuthorsEditor
        authors={[
          { name: "First", affiliation: null, orcid: null },
          { name: "Second", affiliation: null, orcid: null },
        ]}
        onChange={onChange}
        onDirty={() => {}}
      />
    ));

    const downButtons = screen.getAllByRole("button", { name: "Down" });
    fireEvent.click(downButtons[0]);

    expect(onChange).toHaveBeenCalledWith([
      { name: "Second", affiliation: null, orcid: null },
      { name: "First", affiliation: null, orcid: null },
    ]);
  });

  it("removes an author when more than one row", () => {
    const onChange = vi.fn();
    render(() => (
      <PublicationAuthorsEditor
        authors={[
          { name: "Keep", affiliation: null, orcid: null },
          { name: "Drop", affiliation: null, orcid: null },
        ]}
        onChange={onChange}
        onDirty={() => {}}
      />
    ));

    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    fireEvent.click(removeButtons[1]);

    expect(onChange).toHaveBeenCalledWith([
      { name: "Keep", affiliation: null, orcid: null },
    ]);
  });
});
