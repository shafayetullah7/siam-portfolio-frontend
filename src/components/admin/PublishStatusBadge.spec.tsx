import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import PublishStatusBadge from "./PublishStatusBadge";

describe("PublishStatusBadge", () => {
  it("renders known publish statuses", () => {
    render(() => <PublishStatusBadge status="draft" />);
    expect(screen.getByText("Draft")).toBeTruthy();
    render(() => <PublishStatusBadge status="published" />);
    expect(screen.getByText("Published")).toBeTruthy();
    render(() => <PublishStatusBadge status="scheduled" />);
    expect(screen.getByText("Scheduled")).toBeTruthy();
    render(() => <PublishStatusBadge status="archived" />);
    expect(screen.getByText("Archived")).toBeTruthy();
  });
});
