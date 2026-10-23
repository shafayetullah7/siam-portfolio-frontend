import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@solidjs/router", () => ({
  query: <T,>(fn: () => T, _key: string) => fn,
}));

vi.mock("../../endpoints/public/contact.api", () => ({
  contactPublicApi: {
    getConfig: vi.fn(),
    submit: vi.fn(),
  },
}));

import { contactPublicApi } from "../../endpoints/public/contact.api";
import { getPublicContactConfig } from "./contact.queries";

describe("public contact queries", () => {
  beforeEach(() => {
    vi.mocked(contactPublicApi.getConfig).mockReset();
  });

  it("getPublicContactConfig delegates to contactPublicApi.getConfig", async () => {
    const payload = { formEnabled: true, categories: [] };
    vi.mocked(contactPublicApi.getConfig).mockResolvedValue(payload as never);
    await expect(getPublicContactConfig()).resolves.toEqual(payload);
    expect(contactPublicApi.getConfig).toHaveBeenCalledOnce();
  });
});
