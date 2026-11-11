import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import TalkPublishControls from "./TalkPublishControls";

const { getPublishCheck, publish } = vi.hoisted(() => ({
  getPublishCheck: vi.fn(),
  publish: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/talks.api", () => ({
  adminTalksApi: {
    getPublishCheck,
    publish,
    unpublish: vi.fn(),
  },
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return { ...actual, revalidate: vi.fn() };
});

describe("TalkPublishControls", () => {
  it("opens dialog when warnings present", async () => {
    getPublishCheck.mockResolvedValue({
      errors: [],
      warnings: [{ code: "no_materials", message: "No materials" }],
    });
    render(() => (
      <TalkPublishControls talkId="id-1" publishStatus="draft" />
    ));
    screen.getByRole("button", { name: "Publish" }).click();
    expect(await screen.findByText("Publish checklist")).toBeTruthy();
  });
});
