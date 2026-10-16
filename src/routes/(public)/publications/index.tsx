import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import PublicationCatalogList from "~/components/catalog/PublicationCatalogList";
import { listPublications } from "~/content";
import { getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
  },
} satisfies RouteDefinition;

export default function PublicationsIndex() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    return buildPageMeta(
      {
        title: "Publications",
        seoDescription: "Peer-reviewed papers, preprints, and workshop contributions.",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Title>{pageMeta()?.title ?? "Publications"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? "Publications"} />
      <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
      <CatalogPageShell
        wide
        title="Publications"
        intro="Selected scholarship and the full publication ledger. Detail pages are stubs until P06."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Publications" }]}
      >
        <PublicationCatalogList showFilterChip />
        <p class="mt-8 font-mono text-xs text-on-surface-variant">
          {listPublications().length} publications in catalog
        </p>
      </CatalogPageShell>
    </>
  );
}
