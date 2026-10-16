import { beforeEach, describe, expect, it, vi } from "vitest";

const { executeRequestMock, forceLogoutMock } = vi.hoisted(() => ({
  executeRequestMock: vi.fn(),
  forceLogoutMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./internal/request", () => ({
  executeRequest: executeRequestMock,
}));

vi.mock("../auth/forceLogout", () => ({
  forceLogout: forceLogoutMock,
}));

vi.mock("./config", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./config")>();
  return {
    ...actual,
    apiBaseUrl: () => "http://localhost:5000/api/v1",
  };
});

const { adminClient } = await import("./admin-client");
const { ApiError } = await import("./types");

describe("adminClient", () => {
  beforeEach(() => {
    executeRequestMock.mockReset();
    forceLogoutMock.mockClear();
    forceLogoutMock.mockResolvedValue(undefined);
  });

  it("does not refresh on 401 for excluded auth paths", async () => {
    executeRequestMock.mockRejectedValueOnce(new ApiError("Unauthorized", 401));

    await expect(
      adminClient.post("/auth/login", {}, { strictAuth: false }),
    ).rejects.toMatchObject({ status: 401 });

    expect(executeRequestMock).toHaveBeenCalledTimes(1);
    expect(forceLogoutMock).not.toHaveBeenCalled();
  });

  it("refreshes once and retries protected request on 401", async () => {
    executeRequestMock
      .mockRejectedValueOnce(new ApiError("Unauthorized", 401))
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ ok: true });

    const result = await adminClient.get<{ ok: boolean }>("/site/settings");

    expect(result).toEqual({ ok: true });
    expect(executeRequestMock).toHaveBeenCalledTimes(3);
    expect(executeRequestMock.mock.calls[1]?.[0]).toMatchObject({
      method: "POST",
      path: "/auth/refresh",
    });
    expect(forceLogoutMock).not.toHaveBeenCalled();
  });

  it("calls forceLogout when refresh fails after 401", async () => {
    executeRequestMock
      .mockRejectedValueOnce(new ApiError("Unauthorized", 401))
      .mockRejectedValueOnce(new ApiError("Unauthorized", 401));

    await expect(adminClient.get("/site/settings")).rejects.toMatchObject({
      status: 401,
    });

    expect(forceLogoutMock).toHaveBeenCalledTimes(1);
  });
});
