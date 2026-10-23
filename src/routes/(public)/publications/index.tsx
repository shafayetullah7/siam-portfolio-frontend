import { createAsync, useSearchParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import PublicationCatalogList from "~/components/catalog/PublicationCatalogList";
import PublicationListFilters from "~/components/publications/PublicationListFilters";
import PublicationListPagination from "~/components/publications/PublicationListPagination";
import {
  getPublicPublications,
  getPublicResearchThemes,
  getPublicSite,
} from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import {
  parsePublicationListSearchParams,
  publicationListHasActiveFilters,
  publicationListSearchParamsToApi,
  setPublicationListPage,
} from "~/lib/publications/publication-list-search-params";

export const route = {
  preload: ({ location }) => {
    void getPublicSite();
    void getPublicResearchThemes();
    const params = parsePublicationListSearchParams(
      Object.fromEntries(new URLSearchParams(location.search)),
    );
    void getPublicPublications(publicationListSearchParamsToApi(params));
  },
} satisfies RouteDefinition;

export default function PublicationsIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const themes = createAsync(() => getPublicResearchThemes(), {
    deferStream: true,
  });

  const filters = () =>
    parsePublicationListSearchParams(searchParams as Record<string, string>);

  const list = createAsync(
    () => getPublicPublications(publicationListSearchParamsToApi(filters())),
    { deferStream: true },
  );

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    return buildPageMeta(
      {
        title: "Publications",
        seoDescription:
          "Peer-reviewed papers, preprints, and workshop contributions.",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  const themeOptions = () =>
    themes()?.items.map((card) => ({ slug: card.slug, title: card.title })) ??
    [];

  return (
    <>
      <Title>{pageMeta()?.title ?? "Publications"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? "Publications"} />
      <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
      <CatalogPageShell
        wide
        title="Publications"
        intro="Selected scholarship and the full publication ledger—peer-reviewed work, preprints, and workshop papers published on this site."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Publications" }]}
      >
        <div class="flex flex-col gap-6">
          <PublicationListFilters
            params={filters()}
            themeOptions={themeOptions()}
            setSearchParams={setSearchParams}
          />
          <Show when={list()} fallback={<p class="text-ink-muted">Loading…</p>}>
            {(data) => (
              <>
                <p class="font-mono text-xs text-on-surface-variant">
                  {data().meta.total}{" "}
                  {data().meta.total === 1 ? "publication" : "publications"}
                  {publicationListHasActiveFilters(filters())
                    ? " matching filters"
                    : ""}
                </p>
                <PublicationCatalogList
                  items={data().items}
                  groupByYear={filters().group === "year"}
                  hasActiveFilters={publicationListHasActiveFilters(filters())}
                />
                <PublicationListPagination
                  meta={data().meta}
                  onPageChange={(page) =>
                    setPublicationListPage(setSearchParams, page)
                  }
                />
              </>
            )}
          </Show>
        </div>
      </CatalogPageShell>
    </>
  );
}
