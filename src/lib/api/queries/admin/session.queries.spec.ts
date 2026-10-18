import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@solidjs/router", () => ({
  query: <T,>(fn: () => T, _key: string) => fn,
}));

vi.mock("solid-js/web", () => ({
  getRequestEvent: vi.fn(),
}));

vi.mock("../../server/adminSession.server", () => ({
  fetchAdminSession: vi.fn(),
}));

import { getRequestEvent } from "solid-js/web";
import { fetchAdminSession } from "../../server/adminSession.server";
import { getAdminSession } from "./session.queries";

describe("getAdminSession", () => {
  beforeEach(() => {
    vi.mocked(getRequestEvent).mockReset();
    vi.mocked(fetchAdminSession).mockReset();
  });

  it("reads cookie from request event and delegates to fetchAdminSession", async () => {
    const request = new Request("http://localhost/admin");
    request.headers.set("Cookie", "sid=1");
    vi.mocked(getRequestEvent).mockReturnValue({ request } as never);
    vi.mocked(fetchAdminSession).mockResolvedValue(null);
    await getAdminSession();
    expect(fetchAdminSession).toHaveBeenCalledWith("sid=1");
  });

  it("passes null when request has no cookie", async () => {
    vi.mocked(getRequestEvent).mockReturnValue({
      request: new Request("http://localhost/admin"),
    } as never);
    vi.mocked(fetchAdminSession).mockResolvedValue(null);
    await getAdminSession();
    expect(fetchAdminSession).toHaveBeenCalledWith(null);
  });
});
