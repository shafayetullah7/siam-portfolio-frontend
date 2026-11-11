import { describe, expect, it } from "vitest";
import { linesToExpertise, parseLinesToTopics } from "./expertise-form";

describe("expertise-form", () => {
  it("parseLinesToTopics splits and trims", () => {
    expect(parseLinesToTopics(" a \n\nb ")).toEqual(["a", "b"]);
  });

  it("linesToExpertise returns null when all empty", () => {
    expect(
      linesToExpertise({
        domains: "",
        methodologies: "",
        tooling: "",
        practices: "",
      }),
    ).toBeNull();
  });
});
