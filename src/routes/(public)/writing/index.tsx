import {
  createAsync,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import PublicationListPagination from "~/components/publications/PublicationListPagination";
import WritingHubPage from "~/components/writing/WritingHubPage";
import WritingListFilters from "~/components/writing/WritingListFilters";
import { getPublicSite, getPublicWriting } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import { DEFAULT_WRITING_HUB_INTRO } from "~/lib/writing/default-writing-hub-intro";
import {
  parseWritingListSearchParams,
  writingListHasActiveFilters,
  writingListPageNumber,
  writingListSearchParamsToApi,
  setWritingListPage,
} from "~/lib/writing/writing-list-search-params";

export const route = {
  preload: ({ location }) => {
    void getPublicSite();
    const params = parseWritingListSearchParams(
      Object.fromEntries(new URLSearchParams(location.search)),
    );
    const showFeaturedBand =
      !writingListHasActiveFilters(params) && writingListPageNumber(params) === 1;
    void getPublicWriting(
      writingListSearchParamsToApi(params, {
        excludeFeaturedOnHub: showFeaturedBand,
        limit: 24,
      }),
    );
    if (showFeaturedBand) {
      void getPublicWriting({ featuredOnHub: true, limit: 1 });
    }
  },
} satisfies RouteDefinition;

export default function WritingIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const filters = () =>
    parseWritingListSearchParams(searchParams as Record<string, string>);

  const showFeaturedBand = () =>
    !writingListHasActiveFilters(filters()) &&
    writingListPageNumber(filters()) === 1;

  const featuredList = createAsync(
    () => {
      if (!showFeaturedBand()) {
        return Promise.resolve(null);
      }
      return getPublicWriting({ featuredOnHub: true, limit: 1 });
    },
    { deferStream: true },
  );

  const mainList = createAsync(
    () =>
      getPublicWriting(
        writingListSearchParamsToApi(filters(), {
          excludeFeaturedOnHub: showFeaturedBand(),
          limit: 24,
        }),
      ),
    { deferStream: true },
  );

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    return buildPageMeta(
      {
        title: "Writing",
        seoDescription:
          "Essays, notes, and long-form technical writing from the portfolio.",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  const hubIntro = () => {
    const list = mainList();
    if (list?.intro?.trim()) return list.intro.trim();
    return DEFAULT_WRITING_HUB_INTRO;
  };

  const featuredItem = () => featuredList()?.items[0] ?? null;

  const showSeriesSections = () =>
    showFeaturedBand() && !filters().series;

  return (
    <>
      <Title>{pageMeta()?.title ?? "Writing"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? "Writing"} />
      <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
      {/* WRIT11: rel=alternate RSS when feed.xml ships */}
      <CatalogPageShell
        wide
        title="Writing"
        intro={hubIntro()}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Writing" }]}
      >
        <div class="flex flex-col gap-6">
          <WritingListFilters
            params={filters()}
            setSearchParams={setSearchParams}
          />
          <Show when={mainList()} fallback={<p class="text-ink-muted">Loading…</p>}>
            {(data) => (
              <>
                <WritingHubPage
                  featuredItem={featuredItem()}
                  seriesSections={data().seriesSections}
                  items={data().items}
                  meta={data().meta}
                  hasActiveFilters={writingListHasActiveFilters(filters())}
                  showSeriesSections={showSeriesSections()}
                />
                <PublicationListPagination
                  meta={data().meta}
                  ariaLabel="Writing pagination"
                  onPageChange={(page) =>
                    setWritingListPage(setSearchParams, page)
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
