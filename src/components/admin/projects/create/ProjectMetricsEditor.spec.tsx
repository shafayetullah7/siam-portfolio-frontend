import { fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import ProjectMetricsEditor from "./ProjectMetricsEditor";

describe("ProjectMetricsEditor", () => {
  it("moves a metric down when Down is clicked", () => {
    const onChange = vi.fn();
    const [metrics, setMetrics] = createSignal([
      { name: "First", value: "1", unit: null, baseline: null, notes: null, caption: null },
      { name: "Second", value: "2", unit: null, baseline: null, notes: null, caption: null },
    ]);

    render(() => (
      <ProjectMetricsEditor
        metrics={metrics()}
        onChange={(next) => {
          setMetrics(next);
          onChange(next);
        }}
        onDirty={() => undefined}
      />
    ));

    const downButtons = screen.getAllByRole("button", { name: "Down" });
    fireEvent.click(downButtons[0]);

    const last = onChange.mock.calls.at(-1)?.[0] as { name: string }[];
    expect(last.map((r) => r.name)).toEqual(["Second", "First"]);
  });
});
