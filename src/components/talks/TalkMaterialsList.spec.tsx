import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import TalkMaterialsList from "./TalkMaterialsList";

describe("TalkMaterialsList", () => {
  it("renders link-out resources and no iframe for video type", () => {
    const { container } = render(() => (
      <TalkMaterialsList
        resources={[
          {
            label: "Talk video",
            url: "https://example.com/v",
            resourceType: "video",
          },
        ]}
      />
    ));
    const link = screen.getByRole("link", { name: "Talk video" });
    expect(link.getAttribute("href")).toBe("https://example.com/v");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(container.querySelector("iframe")).toBeNull();
  });
});
