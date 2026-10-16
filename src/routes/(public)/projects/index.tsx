import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import ProjectCatalogGrid from "~/components/catalog/ProjectCatalogGrid";
import { listProjects } from "~/content";
import { getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
  },
} satisfies RouteDefinition;

export default function ProjectsIndex() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    return buildPageMeta(
      {
        title: "Projects",
        seoDescription: "Open-source artifacts, prototypes, and research systems.",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Title>{pageMeta()?.title ?? "Projects"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? "Projects"} />
      <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
      <CatalogPageShell
        wide
        title="Projects"
        intro="Artifacts and systems built for reproducibility and real-world evaluation."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      >
        <ProjectCatalogGrid />
        <p class="mt-8 font-mono text-xs text-on-surface-variant">
          {listProjects().length} projects in catalog
        </p>
      </CatalogPageShell>
    </>
  );
}
