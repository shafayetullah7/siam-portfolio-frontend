import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import TimelineEntryForm from "./TimelineEntryForm";
import {
  emptyTimelineDraft,
  type TimelineEntryWriteInput,
} from "~/lib/forms/schemas/timeline-entry-write.schema";

vi.mock("./TimelineRelatedWorkFields", () => ({
  default: () => null,
}));

describe("TimelineEntryForm", () => {
  it("clears award-specific fields when kind switches to education", async () => {
    let draft: TimelineEntryWriteInput = {
      ...emptyTimelineDraft(),
      kind: "award",
      rankOrPlacement: "1st place",
      proofUrl: "https://example.com",
    };
    const onChange = vi.fn((next: TimelineEntryWriteInput) => {
      draft = next;
    });

    render(() => (
      <TimelineEntryForm
        draft={draft}
        fieldErrors={{}}
        onChange={onChange}
        allowKindChange
      />
    ));

    const select = await screen.findByRole("combobox");
    select.value = "education";
    select.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalled();
    const last = onChange.mock.calls.at(-1)?.[0] as TimelineEntryWriteInput;
    expect(last.kind).toBe("education");
    expect(last.rankOrPlacement).toBeNull();
    expect(last.proofUrl).toBeNull();
  });
});
