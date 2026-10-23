import type { APIEvent } from "@solidjs/start/server";
import { listCatalogSitemapPaths } from "~/content/catalog";
import { projectsPublicApi } from "~/lib/api/endpoints/public/projects.api";
import { publicationsPublicApi } from "~/lib/api/endpoints/public/publications.api";
import { researchPublicApi } from "~/lib/api/endpoints/public/research.api";
import { timelinePublicApi } from "~/lib/api/endpoints/public/timeline.api";
import { writingPublicApi } from "~/lib/api/endpoints/public/writing.api";
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
  try {
    const pubs = await publicationsPublicApi.list({ limit: 100 });
    paths = [
      ...new Set([
        ...paths,
        "/publications",
        ...pubs.items.map((p) => `/publications/${p.slug}`),
      ]),
    ];
  } catch {
    // omit publication slugs when API offline
  }
  try {
    const projects = await projectsPublicApi.list({ limit: 100 });
    paths = [
      ...new Set([
        ...paths,
        "/projects",
        ...projects.items.map((p) => `/projects/${p.slug}`),
      ]),
    ];
  } catch {
    // omit project slugs when API offline
  }
  try {
    const writing = await writingPublicApi.list({ limit: 100 });
    paths = [
      ...new Set([
        ...paths,
        "/writing",
        ...writing.items.map((a) => `/writing/${a.slug}`),
      ]),
    ];
  } catch {
    // omit writing slugs when API offline
  }
  try {
    const achievements = await timelinePublicApi.listAchievements({ limit: 100 });
    const achievementSlugs = achievements.sections.flatMap((section) =>
      section.items
        .map((item) => item.href?.replace(/^\/achievements\//, "") ?? "")
        .filter(Boolean),
    );
    if (achievementSlugs.length > 0) {
      paths = [
        ...new Set([
          ...paths,
          "/achievements",
          ...achievementSlugs.map((s) => `/achievements/${s}`),
        ]),
      ];
    }
  } catch {
    // omit achievement slugs when API offline
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
