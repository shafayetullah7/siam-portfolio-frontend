import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../types";

vi.mock("../internal/request", () => ({
  executeRequest: vi.fn(),
}));

import { executeRequest } from "../internal/request";
import { fetchAdminSession } from "./adminSession.server";

const profile = {
  id: "1",
  firstName: "Dev",
  lastName: "Admin",
  userName: "dev_admin",
  email: "dev@example.com",
  mfaEnabled: false,
};

describe("fetchAdminSession", () => {
  beforeEach(() => {
    vi.mocked(executeRequest).mockReset();
  });

  it("forwards Cookie header when present", async () => {
    vi.mocked(executeRequest).mockResolvedValue(profile);
    await expect(fetchAdminSession("session=abc")).resolves.toEqual(profile);
    expect(executeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        path: "/auth/check",
        headers: { Cookie: "session=abc" },
        credentials: "omit",
      }),
    );
  });

  it("omits Cookie header when cookie is null", async () => {
    vi.mocked(executeRequest).mockResolvedValue(profile);
    await fetchAdminSession(null);
    expect(executeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: {},
      }),
    );
  });

  it("returns null on ApiError (e.g. 401)", async () => {
    vi.mocked(executeRequest).mockRejectedValue(new ApiError("Unauthorized", 401));
    await expect(fetchAdminSession("session=expired")).resolves.toBeNull();
  });
});
