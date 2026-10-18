// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore node builtin, server side only
import { appendFileSync } from "node:fs";
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

export type AdminAuthProviderProps = ParentProps & {
  /** After SSR `getAdminSession`: profile or `null`. Omit for client-only mounts (tests). */
  initialAdmin?: AdminProfile | null;
};

function initialStatus(initialAdmin?: AdminProfile | null): AdminAuthStatus {
  if (initialAdmin === undefined) return "unknown";
  return initialAdmin ? "authenticated" : "anonymous";
}

export function AdminAuthProvider(props: AdminAuthProviderProps) {
  const [status, setStatus] = createSignal<AdminAuthStatus>(
    initialStatus(props.initialAdmin),
  );
  const [admin, setAdmin] = createSignal<AdminProfile | null>(
    props.initialAdmin ?? null,
  );
  // #region agent log
  const _p = JSON.stringify({sessionId:'1e53c5',hypothesisId:'B',location:'AdminAuthProvider.tsx:init',message:'provider initial state',data:{isServer:typeof window==='undefined',initialAdmin:props.initialAdmin===undefined?'undefined':props.initialAdmin===null?'null':'profile',status:status()},timestamp:Date.now()});
  if (typeof window==='undefined') { try { appendFileSync("/home/wtaslim2/Desktop/projects/siam/.cursor/debug-1e53c5.log", _p + "\n"); } catch { /* ignore */ } } else { fetch('/api/__debug-log',{method:'POST',headers:{'Content-Type':'application/json'},body:_p}).catch(()=>{}); }
  // #endregion

  const value: AdminAuthContextValue = {
    status,
    admin,
    async bootstrap() {
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
