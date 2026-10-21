import type { APIEvent } from "@solidjs/start/server";
import { listCatalogSitemapPaths } from "~/content/catalog";
import { researchPublicApi } from "~/lib/api/endpoints/public/research.api";
import { sitePublicApi } from "~/lib/api/endpoints/public/site.api";
import { getSiteOrigin } from "~/lib/site/siteOrigin";

export async function GET(_event: APIEvent) {
  let paths = ["/", "/about", ...listCatalogSitemapPaths()];
  try {
    const site = await sitePublicApi.get();
    paths = [...new Set([...site.sitemapPaths, ...listCatalogSitemapPaths()])];
  } catch {
    // fallback when API offline
  }
  try {
    // Fallback when site.sitemapPaths lacks research (API offline or older deploy).
    const hub = await researchPublicApi.list();
    paths = [
      ...new Set([
        ...paths,
        "/research",
        ...hub.items.map((t) => `/research/${t.slug}`),
      ]),
    ];
  } catch {
    // omit research slugs when API offline
  }
  const origin = getSiteOrigin();
  const urls = paths
    .map((p) => `  <url><loc>${origin}${p}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
