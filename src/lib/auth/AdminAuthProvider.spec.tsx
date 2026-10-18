import { render, waitFor } from "@solidjs/testing-library";
import { createSignal, type JSX } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import type { AdminProfile } from "~/lib/api/types/admin.types";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuthProvider";

const profile: AdminProfile = {
  id: "1",
  firstName: "Dev",
  lastName: "Admin",
  userName: "dev_admin",
  email: "dev@example.com",
  mfaEnabled: false,
};

vi.mock("~/lib/api/endpoints/admin/auth.api", () => ({
  adminAuthApi: {
    check: vi.fn(),
  },
}));

import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";

function StatusProbe(props: { onStatus: (s: string) => void }) {
  const auth = useAdminAuth();
  props.onStatus(auth.status());
  return null as JSX.Element;
}

describe("AdminAuthProvider", () => {
  it("starts authenticated when initialAdmin is a profile", () => {
    let status = "";
    render(() => (
      <AdminAuthProvider initialAdmin={profile}>
        <StatusProbe onStatus={(s) => (status = s)} />
      </AdminAuthProvider>
    ));
    expect(status).toBe("authenticated");
  });

  it("starts anonymous when initialAdmin is null", () => {
    let status = "";
    render(() => (
      <AdminAuthProvider initialAdmin={null}>
        <StatusProbe onStatus={(s) => (status = s)} />
      </AdminAuthProvider>
    ));
    expect(status).toBe("anonymous");
  });

  it("bootstrap does not set unknown when revalidating from initialAdmin", async () => {
    const statuses: string[] = [];
    vi.mocked(adminAuthApi.check).mockImplementation(async () => {
      statuses.push("check-start");
      return profile;
    });

    render(() => (
      <AdminAuthProvider initialAdmin={profile}>
        <StatusProbe
          onStatus={(s) => {
            if (!statuses.includes(s)) statuses.push(s);
          }}
        />
      </AdminAuthProvider>
    ));

    await waitFor(() => {
      expect(adminAuthApi.check).toHaveBeenCalled();
    });
    expect(statuses).not.toContain("unknown");
  });
});
