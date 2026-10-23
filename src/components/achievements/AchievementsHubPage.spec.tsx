import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import AchievementsHubPage from "./AchievementsHubPage";
import type { TimelinePublicSection } from "~/lib/api/types/timeline.types";

describe("AchievementsHubPage", () => {
  it("does not render headings for empty sections", () => {
    const sections: TimelinePublicSection[] = [
      {
        kind: "award",
        items: [
          {
            id: "1",
            kind: "award",
            title: "Visible award",
            subtitle: null,
            organization: null,
            location: null,
            startDate: null,
            endDate: null,
            isOngoing: false,
            featured: false,
            proofUrl: null,
            images: [],
          },
        ],
      },
    ];

    render(() => <AchievementsHubPage sections={sections} />);
    expect(screen.getByRole("heading", { name: "Award" })).toBeTruthy();
    expect(screen.getByText("Visible award")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Certification" })).toBeNull();
  });
});
