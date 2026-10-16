import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@solidjs/router", () => ({
  query: <T,>(fn: () => T, _key: string) => fn,
}));

vi.mock("../../endpoints/public/site.api", () => ({
  sitePublicApi: {
    get: vi.fn(),
    home: vi.fn(),
    about: vi.fn(),
  },
}));

import { sitePublicApi } from "../../endpoints/public/site.api";
import { getPublicAbout, getPublicHome, getPublicSite } from "./site.queries";

describe("public site queries", () => {
  beforeEach(() => {
    vi.mocked(sitePublicApi.get).mockReset();
    vi.mocked(sitePublicApi.home).mockReset();
    vi.mocked(sitePublicApi.about).mockReset();
  });

  it("getPublicSite delegates to sitePublicApi.get", async () => {
    const payload = { siteName: "Test" };
    vi.mocked(sitePublicApi.get).mockResolvedValue(payload as never);
    await expect(getPublicSite()).resolves.toEqual(payload);
    expect(sitePublicApi.get).toHaveBeenCalledOnce();
  });

  it("getPublicHome delegates to sitePublicApi.home", async () => {
    vi.mocked(sitePublicApi.home).mockResolvedValue({ heroTitle: "Hi" } as never);
    await getPublicHome();
    expect(sitePublicApi.home).toHaveBeenCalledOnce();
  });

  it("getPublicAbout delegates to sitePublicApi.about", async () => {
    vi.mocked(sitePublicApi.about).mockResolvedValue({ headline: "About" } as never);
    await getPublicAbout();
    expect(sitePublicApi.about).toHaveBeenCalledOnce();
  });
});
