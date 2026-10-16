import { createSignal } from "solid-js";
import type { AdminProfile } from "~/lib/api/types/admin.types";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";

const [admin, setAdmin] = createSignal<AdminProfile | null>(null);
const [checked, setChecked] = createSignal(false);

export const adminSession = {
  admin,
  checked,
  setAdmin,
  async load() {
    try {
      const profile = await adminAuthApi.check();
      setAdmin(profile);
    } catch {
      setAdmin(null);
    } finally {
      setChecked(true);
    }
  },
  clear() {
    setAdmin(null);
  },
};
