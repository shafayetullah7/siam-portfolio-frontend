import type { APIEvent } from "@solidjs/start/server";
import { sitePublicApi } from "~/lib/api/endpoints/public/site.api";

export async function GET(_event: APIEvent) {
  let paths = ["/", "/about"];
  try {
    const site = await sitePublicApi.get();
    paths = site.sitemapPaths;
  } catch {
    // fallback when API offline
  }
  const origin = import.meta.env.VITE_SITE_ORIGIN ?? "http://localhost:3000";
  const urls = paths
    .map((p) => `  <url><loc>${origin}${p}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
