import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import TimelineEntryRow from "./TimelineEntryRow";
import type { TimelinePublicCard } from "~/lib/api/types/timeline.types";

const card: TimelinePublicCard = {
  id: "1",
  kind: "research_experience",
  title: "Research role",
  subtitle: null,
  organization: "Lab",
  location: null,
  startDate: "2022-01-01",
  endDate: null,
  isOngoing: true,
  featured: false,
  proofUrl: null,
  images: [],
};

describe("TimelineEntryRow", () => {
  it("shows Present for ongoing roles", () => {
    render(() => <TimelineEntryRow card={card} />);
    expect(screen.getByText(/Present/)).toBeTruthy();
  });
});
