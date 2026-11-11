import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import EmptyState from "~/components/EmptyState";
import TalksHubPage from "~/components/talks/TalksHubPage";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";
import { getPublicSite } from "~/lib/api/queries/public";
import { getPublicTalks } from "~/lib/api/queries/public/talks.queries";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import { DEFAULT_TALKS_HUB_INTRO } from "~/lib/talks/default-talks-hub-intro";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicTalks();
  },
} satisfies RouteDefinition;

export default function TalksIndex() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const hub = createAsync(() => getPublicTalks(), { deferStream: true });

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    const intro = hubIntro();
    return buildPageMeta(
      {
        title: "Talks",
        seoDescription: intro,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  const hubIntro = () => {
    const data = hub();
    if (data?.intro?.trim()) return data.intro.trim();
    return DEFAULT_TALKS_HUB_INTRO;
  };

  const isEmptyHub = () => {
    const data = hub();
    if (data === undefined) return false;
    return data.upcoming.length + data.past.length === 0;
  };

  return (
    <>
      <Show when={hub() !== undefined && isEmptyHub()}>
        <div class={PUBLIC_PAGE_WIDE}>
          <Title>Page not found</Title>
          <EmptyState
            title="Page not found"
            description="The address may be wrong, or the page may have moved."
          />
        </div>
      </Show>
      <Show when={hub()}>
        {(hubData) => (
          <Show when={!isEmptyHub()}>
            <>
              <Title>{pageMeta()?.title ?? "Talks"}</Title>
              <Meta name="description" content={pageMeta()?.description ?? ""} />
              <Meta property="og:title" content={pageMeta()?.ogTitle ?? "Talks"} />
              <Meta
                property="og:description"
                content={pageMeta()?.ogDescription ?? ""}
              />
              <CatalogPageShell
                wide
                title="Talks"
                intro={hubIntro()}
                breadcrumbs={[{ label: "Home", href: "/" }, { label: "Talks" }]}
              >
                <TalksHubPage
                  upcoming={hubData().upcoming}
                  past={hubData().past}
                />
              </CatalogPageShell>
            </>
          </Show>
        )}
      </Show>
    </>
  );
}
