import { createAsync, useSearchParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import PublicationListPagination from "~/components/publications/PublicationListPagination";
import ProjectListFilters from "~/components/projects/ProjectListFilters";
import ProjectPublicCatalogList from "~/components/projects/ProjectPublicCatalogList";
import { getPublicProjects, getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import { DEFAULT_PROJECTS_HUB_INTRO } from "~/lib/projects/default-projects-hub-intro";
import {
  parseProjectListSearchParams,
  projectListHasActiveFilters,
  projectListPageNumber,
  projectListSearchParamsToApi,
  setProjectListPage,
} from "~/lib/projects/project-list-search-params";

export const route = {
  preload: ({ location }) => {
    void getPublicSite();
    const params = parseProjectListSearchParams(
      Object.fromEntries(new URLSearchParams(location.search)),
    );
    const showFeaturedBand =
      !projectListHasActiveFilters(params) && projectListPageNumber(params) === 1;
    void getPublicProjects(
      projectListSearchParamsToApi(params, {
        excludeFeatured: showFeaturedBand,
      }),
    );
    if (showFeaturedBand) {
      void getPublicProjects({ featured: true, limit: 12 });
    }
  },
} satisfies RouteDefinition;

export default function ProjectsIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const filters = () =>
    parseProjectListSearchParams(searchParams as Record<string, string>);

  const showFeaturedBand = () =>
    !projectListHasActiveFilters(filters()) &&
    projectListPageNumber(filters()) === 1;

  const featuredList = createAsync(
    () => {
      if (!showFeaturedBand()) {
        return Promise.resolve(null);
      }
      return getPublicProjects({ featured: true, limit: 12 });
    },
    { deferStream: true },
  );

  const mainList = createAsync(
    () =>
      getPublicProjects(
        projectListSearchParamsToApi(filters(), {
          excludeFeatured: showFeaturedBand(),
        }),
      ),
    { deferStream: true },
  );

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

  const hubIntro = () => {
    const list = mainList();
    if (list?.intro?.trim()) return list.intro.trim();
    return DEFAULT_PROJECTS_HUB_INTRO;
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
        intro={hubIntro()}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      >
        <div class="flex flex-col gap-6">
          <ProjectListFilters
            params={filters()}
            setSearchParams={setSearchParams}
          />
          <Show when={mainList()} fallback={<p class="text-ink-muted">Loading…</p>}>
            {(data) => (
              <>
                <p class="font-mono text-xs text-on-surface-variant">
                  {data().meta.total}{" "}
                  {data().meta.total === 1 ? "project" : "projects"}
                  {projectListHasActiveFilters(filters())
                    ? " matching filters"
                    : ""}
                </p>
                <ProjectPublicCatalogList
                  featuredItems={showFeaturedBand() ? featuredList()?.items : undefined}
                  items={data().items}
                  hasActiveFilters={projectListHasActiveFilters(filters())}
                />
                <PublicationListPagination
                  meta={data().meta}
                  ariaLabel="Projects pagination"
                  onPageChange={(page) =>
                    setProjectListPage(setSearchParams, page)
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
