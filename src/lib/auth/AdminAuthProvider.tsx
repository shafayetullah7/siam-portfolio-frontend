import {
  createContext,
  createSignal,
  onMount,
  type ParentProps,
  useContext,
} from "solid-js";
import type { AdminProfile } from "~/lib/api/types/admin.types";
import { adminAuthApi } from "~/lib/api/endpoints/admin/auth.api";
import type {
  AdminAuthContextValue,
  AdminAuthStatus,
} from "./admin-auth.types";
import {
  ADMIN_BOOTSTRAP_TIMEOUT_MS,
  withTimeout,
} from "./bootstrapWithTimeout";
import { registerAdminAuthBridge } from "./adminSession";

const AdminAuthContext = createContext<AdminAuthContextValue>();

export function AdminAuthProvider(props: ParentProps) {
  const [status, setStatus] = createSignal<AdminAuthStatus>("unknown");
  const [admin, setAdmin] = createSignal<AdminProfile | null>(null);

  const value: AdminAuthContextValue = {
    status,
    admin,
    async bootstrap() {
      setStatus("unknown");
      try {
        const profile = await withTimeout(
          adminAuthApi.check(),
          ADMIN_BOOTSTRAP_TIMEOUT_MS,
        );
        setAdmin(profile);
        setStatus("authenticated");
      } catch {
        setAdmin(null);
        setStatus("anonymous");
      }
    },
    setFromLogin(profile) {
      setAdmin(profile);
      setStatus("authenticated");
    },
    clear() {
      setAdmin(null);
      setStatus("anonymous");
    },
  };

  registerAdminAuthBridge(value);

  onMount(() => {
    void value.bootstrap();
  });

  return (
    <AdminAuthContext.Provider value={value}>
      {props.children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
