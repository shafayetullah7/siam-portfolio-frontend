# Admin auth — frontend route and client map

Cross-reference for [siam-api/docs/admin-auth.md](../../siam-api/docs/admin-auth.md) **Implementation status** and [admin-auth-delivery-phases.md](../../docs/admin-auth-delivery-phases.md).

## Public auth paths

Defined in [`src/lib/auth/publicAdminAuthPaths.ts`](../src/lib/auth/publicAdminAuthPaths.ts):

- `/admin/login`
- `/admin/register`
- `/admin/register/verify`
- `/admin/forgot-password`
- `/admin/reset-password`

**Planned (not in list yet):** `/admin/security` (MFA), possible `/admin/login/mfa` challenge route (AA6).

## Route file layout (SolidStart)

Auth URLs are not all the same *shape* on disk:

| Style | When | Examples in this repo |
|-------|------|------------------------|
| Flat `admin/<name>.tsx` | Exactly one page for that URL | `login.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `change-password.tsx` |
| Folder `admin/<segment>/index.tsx` + siblings | Two or more URLs under `/admin/<segment>/…` | `register/index.tsx` + `register/verify.tsx` |

Do **not** add `admin/register.tsx` alongside `admin/register/` — use `register/index.tsx` only ([solid-solidstart.md §8.2](./solid-solidstart.md#82-siam-conventions-when-to-use-a-file-vs-a-folder)).

If MFA adds `/admin/login/mfa`, use `admin/login/index.tsx` (move today’s login page from `login.tsx`) + `admin/login/mfa.tsx`, or a dedicated flat route if the URL stays a single segment.

## Routes

| Route | File | API (`adminAuthApi`) | Zod schema | Submit pattern |
|-------|------|----------------------|------------|----------------|
| `/admin/login` | [`routes/admin/login.tsx`](../src/routes/admin/login.tsx) | `login`, `registrationStatus` (register link) | `admin-login.schema.ts` | `loginAction` + `useSubmission` |
| `/admin/register` | [`routes/admin/register/index.tsx`](../src/routes/admin/register/index.tsx) | `register`, `registrationStatus` (disabled gate) | `admin-register.schema.ts` | `registerAction` + `useSubmission`; `AdminAuthLayout`; `FormField` |
| `/admin/register/verify` | [`routes/admin/register/verify.tsx`](../src/routes/admin/register/verify.tsx) | `registrationStatus`, `verifyRegistration`, `resendRegistrationOtp` | `admin-verify-otp.schema.ts` | `verifyRegistrationAction` + resend button; `AdminAuthLayout` |
| `/admin/forgot-password` | [`routes/admin/forgot-password.tsx`](../src/routes/admin/forgot-password.tsx) | `forgotPassword` | `admin-forgot-password.schema.ts` | `forgotPasswordAction` + `useSubmission`; `AdminAuthLayout` |
| `/admin/reset-password` | [`routes/admin/reset-password.tsx`](../src/routes/admin/reset-password.tsx) | `resetPassword` | `admin-reset-password.schema.ts` | `resetPasswordAction` + hidden `token`; success → `/admin/login?message=password_reset` |
| `/admin/change-password` | [`routes/admin/change-password.tsx`](../src/routes/admin/change-password.tsx) | `changePassword` | `admin-change-password.schema.ts` | `changePasswordAction` + `useSubmission` (guarded) |

## Client module

[`src/lib/api/endpoints/admin/auth.api.ts`](../src/lib/api/endpoints/admin/auth.api.ts)

| Method | HTTP | Implemented |
|--------|------|-------------|
| `check` | `GET /auth/check` | yes |
| `login` | `POST /auth/login` | yes |
| `logout` | `POST /auth/logout` | yes |
| `refresh` | `POST /auth/refresh` | yes (via `adminClient`) |
| `register` | `POST /auth/register` | yes |
| `verifyRegistration` | `POST /auth/verify-registration` | yes |
| `registrationStatus` | `GET /auth/registration-status` | yes |
| `resendRegistrationOtp` | `POST /auth/resend-registration-otp` | yes |
| `forgotPassword` | `POST /auth/forgot-password` | yes |
| `resetPassword` | `POST /auth/reset-password` | yes |
| `changePassword` | `POST /auth/change-password` | yes |
| MFA helpers | `mfa/*` | **no** (AA6) |

## Types

[`src/lib/api/types/admin.types.ts`](../src/lib/api/types/admin.types.ts) — `AdminProfile` includes `mfaEnabled`; no admin UI reads it yet (AA6).

## Session and guard

- [`AdminAuthProvider.tsx`](../src/lib/auth/AdminAuthProvider.tsx) — `bootstrap()` → `check`
- [`admin.tsx`](../src/routes/admin.tsx) — anonymous redirect to login + `returnUrl`; authenticated redirect off public auth pages
- [`admin-client.ts`](../src/lib/api/admin-client.ts) — CSRF header, 403 CSRF one-retry, refresh, `forceLogout`
- API **429** on login/register/forgot/verify/reset — `getAuthFormErrorMessage` (AA2 throttling on Nest)
- [`forceLogout.ts`](../src/lib/auth/forceLogout.ts) — `reason=session_expired` and `returnUrl` when session dies on a protected path

## E2e

| Spec | Covers |
|------|--------|
| [`e2e/admin-login.spec.ts`](../e2e/admin-login.spec.ts) | Successful login + logout (CI seed); invalid login |
| [`e2e/admin-guard.spec.ts`](../e2e/admin-guard.spec.ts) | Protected route → login + `returnUrl` |
| [`e2e/admin-auth-journey.spec.ts`](../e2e/admin-auth-journey.spec.ts) | Seeded login → `/admin/pages` → logout |

**API e2e:** [`admin-auth-journey.e2e-spec.ts`](../../siam-api/test/admin-auth-journey.e2e-spec.ts) (register → verify → guarded → logout; login path); [`admin-password-reset.e2e-spec.ts`](../../siam-api/test/admin-password-reset.e2e-spec.ts); registration + throttle specs. CI: `siam-api` job runs `pnpm test:e2e` (serial).

**Gaps:** MFA UI/API (AA6); Playwright register/verify and forgot/reset UI journeys optional.

## Error mapping

Auth pages use [`getAuthFormErrorMessage`](../src/lib/api/errors.ts). See API doc **HTTP errors** for status codes (login `404`/`400`, not `401`).
