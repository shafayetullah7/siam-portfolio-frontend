import { describe, expect, it } from "vitest";
import { formatAffiliationLine } from "./affiliationFormat";

describe("formatAffiliationLine", () => {
  it("joins role and organization with middle dots", () => {
    expect(
      formatAffiliationLine({
        role: "Research Scientist",
        organization: "Example Lab",
      }),
    ).toBe("Research Scientist · Example Lab");
  });

  it("appends location when present", () => {
    expect(
      formatAffiliationLine({
        role: "PhD Candidate",
        organization: "University",
        location: "City, Country",
      }),
    ).toBe("PhD Candidate · University · City, Country");
  });

  it("omits empty location", () => {
    expect(
      formatAffiliationLine({
        role: "Role",
        organization: "Org",
        location: "   ",
      }),
    ).toBe("Role · Org");
  });
});
