const DEFAULT_SITE_ORIGIN = "http://localhost:3000";

export function getSiteOrigin(): string {
  const origin = import.meta.env.VITE_SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN;
  return origin.replace(/\/$/, "");
}
