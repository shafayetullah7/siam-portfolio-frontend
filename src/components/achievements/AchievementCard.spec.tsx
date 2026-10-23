import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import AchievementCard from "./AchievementCard";
import type { TimelinePublicCard } from "~/lib/api/types/timeline.types";

function baseCard(
  overrides: Partial<TimelinePublicCard> = {},
): TimelinePublicCard {
  return {
    id: "00000000-0000-4000-8000-000000000099",
    kind: "award",
    title: "Test title",
    subtitle: null,
    organization: "Org",
    location: null,
    startDate: "2024-01-01",
    endDate: null,
    isOngoing: false,
    featured: false,
    proofUrl: null,
    images: [],
    ...overrides,
  };
}

describe("AchievementCard", () => {
  it("shows award kind label", () => {
    render(() => <AchievementCard card={baseCard({ kind: "award" })} />);
    expect(screen.getByText("Award")).toBeTruthy();
  });

  it("shows certification kind label", () => {
    render(() => (
      <AchievementCard card={baseCard({ kind: "certification" })} />
    ));
    expect(screen.getByText("Certification")).toBeTruthy();
  });
});
