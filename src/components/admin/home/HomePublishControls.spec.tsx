import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest";
import HomePublishControls from "./HomePublishControls";

const { getPublishCheck, publish, unpublish } = vi.hoisted(() => ({
  getPublishCheck: vi.fn(),
  publish: vi.fn(),
  unpublish: vi.fn(),
}));

vi.mock("~/lib/api/endpoints/admin/home.api", () => ({
  adminHomeApi: {
    getPublishCheck,
    publish,
    unpublish,
  },
}));

vi.mock("~/lib/api/endpoints/admin/profile.api", () => ({
  adminProfileApi: {
    getPublishCheck: vi.fn(),
    publish: vi.fn(),
    unpublish: vi.fn(),
  },
}));

vi.mock("@solidjs/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@solidjs/router")>();
  return {
    ...actual,
    revalidate: vi.fn(),
  };
});

describe("HomePublishControls", () => {
  it("opens checklist when warnings exist", async () => {
    getPublishCheck.mockResolvedValue({
      errors: [],
      warnings: [{ code: "FEATURED_NOT_PUBLISHED", message: "Draft featured" }],
    });
    render(() => (
      <HomePublishControls
        target="homepage"
        label="Homepage"
        publishStatus="draft"
      />
    ));
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    expect(await screen.findByText("Publish checklist")).toBeTruthy();
    expect(screen.getByText("Draft featured")).toBeTruthy();
  });

  it("publishes directly when checklist is clean", async () => {
    getPublishCheck.mockResolvedValue({ errors: [], warnings: [] });
    publish.mockResolvedValue({ id: "h1", publishStatus: "published" });
    const onUpdate = vi.fn();
    render(() => (
      <HomePublishControls
        target="homepage"
        label="Homepage"
        publishStatus="draft"
        onHomepageUpdated={onUpdate}
      />
    ));
    fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    await vi.waitFor(() =>
      expect(publish).toHaveBeenCalledWith({ confirmWarnings: false }),
    );
    expect(onUpdate).toHaveBeenCalled();
  });
});
