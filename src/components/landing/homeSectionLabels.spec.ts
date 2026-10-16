import { describe, expect, it } from "vitest";
import { getNonHeroSectionIds, HOME_SECTION_LABELS } from "./homeSectionLabels";

describe("HOME_SECTION_LABELS", () => {
  it("defines labels for every non-hero section id", () => {
    for (const id of getNonHeroSectionIds()) {
      const label = HOME_SECTION_LABELS[id];
      expect(label.domId).toBeTruthy();
      expect(label.title).toBeTruthy();
      expect(label.shipsInPhase).toMatch(/^LP[2-5]$/);
    }
  });
});
