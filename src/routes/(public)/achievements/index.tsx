import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import AchievementsHubPage from "~/components/achievements/AchievementsHubPage";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import EmptyState from "~/components/EmptyState";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";
import {
  getPublicAchievements,
  getPublicSite,
} from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import {
  countAchievementItems,
  flattenSections,
  MAX_FEATURED_ACHIEVEMENTS_DISPLAY,
  sectionsWithoutFeaturedIds,
} from "~/lib/timeline/achievements-hub";
import { DEFAULT_ACHIEVEMENTS_HUB_INTRO } from "~/lib/timeline/default-achievements-hub-intro";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicAchievements({ sort: "startDateDesc" });
    void getPublicAchievements({ featured: true });
  },
} satisfies RouteDefinition;

export default function AchievementsIndex() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const hub = createAsync(
    () => getPublicAchievements({ sort: "startDateDesc" }),
    { deferStream: true },
  );
  const featuredHub = createAsync(
    () => getPublicAchievements({ featured: true }),
    { deferStream: true },
  );

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    return buildPageMeta(
      {
        title: "Achievements",
        seoDescription:
          "Awards, certifications, competitions, and other recognition from the portfolio.",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  const hubIntro = () => {
    const data = hub();
    if (data?.intro?.trim()) return data.intro.trim();
    return DEFAULT_ACHIEVEMENTS_HUB_INTRO;
  };

  const featuredItems = () => {
    const data = featuredHub();
    if (!data) return [];
    return flattenSections(data.sections).slice(
      0,
      MAX_FEATURED_ACHIEVEMENTS_DISPLAY,
    );
  };

  const sectionsForDisplay = () => {
    const data = hub();
    if (!data) return [];
    const ids = new Set(featuredItems().map((item) => item.id));
    if (ids.size === 0) return data.sections;
    return sectionsWithoutFeaturedIds(data.sections, ids);
  };

  const isEmptyHub = () => {
    const data = hub();
    if (data === undefined) return false;
    return countAchievementItems(data.sections) === 0;
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
      <Show when={hub() !== undefined && !isEmptyHub()}>
        <>
          <Title>{pageMeta()?.title ?? "Achievements"}</Title>
          <Meta name="description" content={pageMeta()?.description ?? ""} />
          <Meta
            property="og:title"
            content={pageMeta()?.ogTitle ?? "Achievements"}
          />
          <Meta
            property="og:description"
            content={pageMeta()?.ogDescription ?? ""}
          />
          <CatalogPageShell
            wide
            title="Achievements"
            intro={hubIntro()}
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Achievements" }]}
          >
            <Show when={hub()} fallback={<p class="text-ink-muted">Loading…</p>}>
              {() => (
                <AchievementsHubPage
                  sections={sectionsForDisplay()}
                  featuredItems={featuredItems()}
                />
              )}
            </Show>
          </CatalogPageShell>
        </>
      </Show>
      <Show when={hub() === undefined}>
        <div class="siam-container py-12 text-ink-muted">Loading…</div>
      </Show>
    </>
  );
}
