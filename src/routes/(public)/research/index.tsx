import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import ResearchThemeList from "~/components/catalog/ResearchThemeList";
import { listResearchThemes } from "~/content";
import { getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
  },
} satisfies RouteDefinition;

export default function ResearchIndex() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    return buildPageMeta(
      {
        title: "Research",
        seoDescription:
          "Research themes and focus areas—interpretability, optimization, and human-aligned oversight.",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Title>{pageMeta()?.title ?? "Research"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? "Research"} />
      <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
      <CatalogPageShell
        wide
        title="Research themes"
        intro="Theoretical rigor met with operational deployments. Each theme links to a detail stub until full P04 pages ship."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
      >
        <ResearchThemeList />
        <p class="mt-8 font-mono text-xs text-on-surface-variant">
          {listResearchThemes().length} themes in catalog
        </p>
      </CatalogPageShell>
    </>
  );
}
