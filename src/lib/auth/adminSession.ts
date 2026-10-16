import type { AdminProfile } from "~/lib/api/types/admin.types";
import type { AdminAuthContextValue } from "./admin-auth.types";

let bridge: AdminAuthContextValue | null = null;

/** Called by AdminAuthProvider so forceLogout can clear session outside components. */
export function registerAdminAuthBridge(value: AdminAuthContextValue) {
  bridge = value;
}

/** @deprecated Prefer useAdminAuth() — kept for gradual migration */
export const adminSession = {
  admin: () => bridge?.admin() ?? null,
  checked: () => bridge?.status() !== "unknown",
  setAdmin(profile: AdminProfile) {
    bridge?.setFromLogin(profile);
  },
  async load() {
    await bridge?.bootstrap();
  },
  clear() {
    bridge?.clear();
  },
};
