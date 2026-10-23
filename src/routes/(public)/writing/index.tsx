import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import WritingHubPage from "~/components/writing/WritingHubPage";
import { getPublicSite, getPublicWriting } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import { DEFAULT_WRITING_HUB_INTRO } from "~/lib/writing/default-writing-hub-intro";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicWriting({ featuredOnHub: true, limit: 1 });
    void getPublicWriting({ excludeFeaturedOnHub: true, page: 1, limit: 24 });
  },
} satisfies RouteDefinition;

export default function WritingIndex() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const featuredList = createAsync(
    () => getPublicWriting({ featuredOnHub: true, limit: 1 }),
    { deferStream: true },
  );

  const mainList = createAsync(
    () =>
      getPublicWriting({
        excludeFeaturedOnHub: true,
        page: 1,
        limit: 24,
      }),
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
        <Show when={mainList()} fallback={<p class="text-ink-muted">Loading…</p>}>
          {(data) => (
            <WritingHubPage
              featuredItem={featuredItem()}
              items={data().items}
              meta={data().meta}
            />
          )}
        </Show>
      </CatalogPageShell>
    </>
  );
}
