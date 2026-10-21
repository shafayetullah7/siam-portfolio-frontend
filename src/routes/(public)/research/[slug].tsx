import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import ResearchThemeDetailView from "~/components/research/ResearchThemeDetailView";
import {
  getPublicResearchTheme,
  getPublicSite,
} from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: ({ params }) => {
    void getPublicSite();
    void getPublicResearchTheme(params.slug);
  },
} satisfies RouteDefinition;

export default function ResearchThemeDetail() {
  const params = useParams();
  const slug = () => params.slug ?? "";
  const theme = createAsync(() => getPublicResearchTheme(slug()), {
    deferStream: true,
  });
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const t = theme();
    const s = site();
    if (!t || !s) return null;
    return buildPageMeta(
      {
        title: t.seo.title,
        seoDescription: t.seo.description,
        body: t.problem ?? t.summary,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Show when={theme() === undefined}>
        <div class="siam-container py-12 text-ink-muted">Loading…</div>
      </Show>
      <Show when={theme() === null}>
        <div class="siam-container py-12">
          <Title>Research theme not found</Title>
          <h1 class="text-2xl font-semibold text-brand-deep">Theme not found</h1>
          <p class="mt-4 text-secondary">
            No research theme matches <code class="font-mono text-sm">{slug()}</code>.
          </p>
          <p class="mt-6">
            <A href="/research" class="text-link font-medium no-underline hover:underline">
              ← All research themes
            </A>
          </p>
        </div>
      </Show>
      <Show when={theme()}>
        {(tAccessor) => {
          const t = tAccessor();
          return (
            <>
              <Title>{pageMeta()?.title ?? t.title}</Title>
              <Meta name="description" content={pageMeta()?.description ?? ""} />
              <Meta property="og:title" content={pageMeta()?.ogTitle ?? t.title} />
              <Meta
                property="og:description"
                content={pageMeta()?.ogDescription ?? ""}
              />
              <ResearchThemeDetailView
                theme={t}
                backHref="/research"
                backLabel="All research themes"
              />
            </>
          );
        }}
      </Show>
    </>
  );
}

