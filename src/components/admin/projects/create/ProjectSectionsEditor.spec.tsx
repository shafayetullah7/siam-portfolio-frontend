import { fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ProjectSectionsEditor from "./ProjectSectionsEditor";

describe("ProjectSectionsEditor", () => {
  it("appends a problem section when the Problem preset is clicked", () => {
    const onChange = vi.fn();
    const [sections, setSections] = createSignal<
      { kind: string; title: string | null; body: string }[]
    >([]);

    render(() => (
      <ProjectSectionsEditor
        sections={sections()}
        onChange={(next) => {
          setSections(next);
          onChange(next);
        }}
        onDirty={() => undefined}
      />
    ));

    fireEvent.click(screen.getByRole("button", { name: "+ Problem" }));

    expect(onChange).toHaveBeenCalled();
    const last = onChange.mock.calls.at(-1)?.[0] as {
      kind: string;
      body: string;
    }[];
    expect(last).toHaveLength(1);
    expect(last[0].kind).toBe("problem");
    expect(last[0].body).toBe("");
  });
});
