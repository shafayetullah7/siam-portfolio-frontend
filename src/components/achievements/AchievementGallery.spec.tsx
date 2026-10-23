import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import AchievementGallery from "./AchievementGallery";

describe("AchievementGallery", () => {
  it("renders two images with alt text", () => {
    render(() => (
      <AchievementGallery
        images={[
          {
            url: "https://example.com/a.jpg",
            alt: "First certificate",
            caption: null,
            sortOrder: 1,
          },
          {
            url: "https://example.com/b.jpg",
            alt: "Second certificate",
            caption: null,
            sortOrder: 0,
          },
        ]}
      />
    ));
    expect(screen.getByRole("img", { name: "First certificate" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Second certificate" })).toBeTruthy();
  });
});
