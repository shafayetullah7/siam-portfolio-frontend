import { describe, expect, it } from "vitest";
import {
  diffResearchThemeSnapshots,
  listRevisionChangeFields,
  summarizeRevisionChanges,
} from "./researchRevisionDiff";

describe("diffResearchThemeSnapshots", () => {
  it("detects a single field change", () => {
    const changes = diffResearchThemeSnapshots(
      { title: "Old", publishStatus: "draft" },
      { title: "New", publishStatus: "draft" },
    );
    expect(changes).toHaveLength(1);
    expect(changes[0].label).toBe("Title");
    expect(changes[0].beforeText).toBe("Old");
    expect(changes[0].afterText).toBe("New");
  });

  it("detects publish status change", () => {
    const changes = diffResearchThemeSnapshots(
      { title: "T", publishStatus: "draft" },
      { title: "T", publishStatus: "published" },
    );
    const status = changes.find((c) => c.field === "publishStatus");
    expect(status).toBeDefined();
    expect(status?.beforeText).toBe("draft");
    expect(status?.afterText).toBe("published");
  });

  it("treats first snapshot as all fields new from empty before", () => {
    const changes = diffResearchThemeSnapshots(undefined, {
      title: "First",
      slug: "first",
    });
    expect(changes.length).toBeGreaterThan(0);
    expect(changes.find((c) => c.field === "title")?.afterText).toBe("First");
    expect(changes.find((c) => c.field === "title")?.beforeText).toBe("(empty)");
  });

  it("returns empty when snapshots match on compared fields", () => {
    const snap = { title: "Same", problem: "P", publishStatus: "draft" };
    expect(diffResearchThemeSnapshots(snap, snap)).toHaveLength(0);
  });
});

describe("listRevisionChangeFields", () => {
  it("lists non-empty change fields with labels", () => {
    const fields = listRevisionChangeFields({
      title: "T",
      publishStatus: "draft",
      problem: "",
    });
    expect(fields.map((f) => f.field)).toEqual(["title", "publishStatus"]);
    expect(fields[0].valueText).toBe("T");
  });
});

describe("summarizeRevisionChanges", () => {
  it("caps long summaries", () => {
    const changes = [
      { field: "a", label: "A", beforeText: "", afterText: "" },
      { field: "b", label: "B", beforeText: "", afterText: "" },
      { field: "c", label: "C", beforeText: "", afterText: "" },
      { field: "d", label: "D", beforeText: "", afterText: "" },
    ];
    expect(summarizeRevisionChanges(changes)).toBe("A, B, C +1 more");
  });
});
