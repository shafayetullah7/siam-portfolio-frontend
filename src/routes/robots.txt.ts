import type { APIEvent } from "@solidjs/start/server";
import { getSiteOrigin } from "~/lib/site/siteOrigin";

export function GET(_event: APIEvent) {
  const origin = getSiteOrigin();
  const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
