const PUBLIC_ADMIN_AUTH_PATHS = [
  "/admin/login",
  "/admin/register",
  "/admin/register/verify",
  "/admin/forgot-password",
  "/admin/reset-password",
] as const;

export function isPublicAdminAuthPath(pathname: string): boolean {
  return PUBLIC_ADMIN_AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/** Authenticated users may stay on reset-password when completing email link. */
export function isResetPasswordPath(pathname: string): boolean {
  return pathname === "/admin/reset-password";
}
