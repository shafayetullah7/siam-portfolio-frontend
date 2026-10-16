import type { AdminProfile } from "~/lib/api/types/admin.types";

export type AdminAuthStatus = "unknown" | "authenticated" | "anonymous";

export type AdminAuthContextValue = {
  status: () => AdminAuthStatus;
  admin: () => AdminProfile | null;
  bootstrap: () => Promise<void>;
  setFromLogin: (profile: AdminProfile) => void;
  clear: () => void;
};
