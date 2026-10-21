import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import ResearchThemePublicList from "~/components/research/ResearchThemePublicList";
import {
  getPublicResearchThemes,
  getPublicSite,
} from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import { DEFAULT_RESEARCH_HUB_INTRO } from "~/lib/research/default-research-hub-intro";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicResearchThemes();
  },
} satisfies RouteDefinition;

export default function ResearchIndex() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const hub = createAsync(() => getPublicResearchThemes(), {
    deferStream: true,
  });

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
        intro={hub()?.intro ?? DEFAULT_RESEARCH_HUB_INTRO}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
      >
        <Show when={hub()} fallback={<p class="text-ink-muted">Loading…</p>}>
          {(data) => <ResearchThemePublicList cards={data().items} />}
        </Show>
      </CatalogPageShell>
    </>
  );
}
