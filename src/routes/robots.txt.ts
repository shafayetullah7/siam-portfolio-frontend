import type { APIEvent } from "@solidjs/start/server";

export function GET(_event: APIEvent) {
  const origin = import.meta.env.VITE_SITE_ORIGIN ?? "http://localhost:3000";
  const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
