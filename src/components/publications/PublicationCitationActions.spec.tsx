import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import PublicationCitationActions from "./PublicationCitationActions";

describe("PublicationCitationActions", () => {
  it("copies formatted citation when button clicked", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      ...navigator,
      clipboard: { writeText },
    });

    render(() => (
      <PublicationCitationActions
        citation={{
          citeKey: "paper",
          formatted: "Author (2024). Title.",
          bibtex: "@misc{paper}",
        }}
      />
    ));

    fireEvent.click(
      screen.getByRole("button", { name: "Copy formatted citation" }),
    );

    expect(writeText).toHaveBeenCalledWith("Author (2024). Title.");
  });
});
