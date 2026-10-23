import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import ExperienceTimelineSection from "./ExperienceTimelineSection";
import type { TimelinePublicSection } from "~/lib/api/types/timeline.types";

function entry(
  id: string,
  title: string,
  start: string,
  end: string | null,
  ongoing: boolean,
): TimelinePublicSection["items"][number] {
  return {
    id,
    kind: "research_experience",
    title,
    subtitle: null,
    organization: "Org",
    location: null,
    startDate: start,
    endDate: end,
    isOngoing: ongoing,
    featured: false,
    proofUrl: null,
    images: [],
  };
}

describe("ExperienceTimelineSection", () => {
  it("renders nothing when sections are empty", () => {
    render(() => (
      <ExperienceTimelineSection sections={[]} intro="Intro" />
    ));
    expect(screen.queryByRole("heading", { name: /Education & experience/i })).toBeNull();
  });

  it("shows concurrent roles as separate entries", () => {
    const sections: TimelinePublicSection[] = [
      {
        kind: "research_experience",
        items: [
          entry("1", "Role A", "2020-01-01", "2022-06-01", false),
          entry("2", "Role B", "2021-01-01", null, true),
        ],
      },
    ];
    render(() => (
      <ExperienceTimelineSection sections={sections} intro="Career path" />
    ));
    expect(screen.getByText("Role A")).toBeTruthy();
    expect(screen.getByText("Role B")).toBeTruthy();
    expect(screen.getByText(/Present/)).toBeTruthy();
  });
});
