# Admin auth (client)

Session UI and `forceLogout` per [../../docs/frontend-developer-guide.md](../../docs/frontend-developer-guide.md) §5–6.

Server contract: [../../../siam-api/docs/admin-auth.md](../../../siam-api/docs/admin-auth.md).

Only **`adminClient`** may trigger `forceLogout` on 401. **`publicClient`** never calls `forceLogout`.

## Provider and guard (F5)

[`AdminAuthProvider.tsx`](./AdminAuthProvider.tsx) wraps [`routes/admin.tsx`](../../routes/admin.tsx):

1. `bootstrap()` → `GET /auth/check` → `authenticated` or `anonymous`
2. While `unknown` → [`PageLoading`](../components/PageLoading.tsx)
3. `anonymous` on protected path → `/admin/login?returnUrl=…`
4. `authenticated` on public auth path (except `/admin/reset-password`) → `/admin`

**Public auth paths** ([`publicAdminAuthPaths.ts`](./publicAdminAuthPaths.ts)): login, register, register/verify, forgot-password, reset-password.

**Hook:** `useAdminAuth()` → `{ status, admin, bootstrap, setFromLogin, clear }`.

[`adminSession.ts`](./adminSession.ts) bridges to the provider for `forceLogout` and legacy callers.

## Forms

Zod schemas in [`../forms/schemas/`](../forms/schemas/); validate with `safeParse` then call `adminAuthApi`. API errors → `getAuthFormErrorMessage` (F4).
