import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import PublicationPublicDetailView from "~/components/publications/PublicationPublicDetailView";
import {
  getPublicPublicationBibtex,
  getPublicPublicationBySlug,
  getPublicSite,
} from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: ({ params }) => {
    void getPublicSite();
    void getPublicPublicationBySlug(params.slug);
    void getPublicPublicationBibtex(params.slug);
  },
} satisfies RouteDefinition;

export default function PublicationDetail() {
  const params = useParams();
  const slug = () => params.slug ?? "";
  const detail = createAsync(() => getPublicPublicationBySlug(slug()), {
    deferStream: true,
  });
  const citation = createAsync(() => getPublicPublicationBibtex(slug()), {
    deferStream: true,
  });
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const d = detail();
    const s = site();
    if (!d || !s) return null;
    return buildPageMeta(
      {
        title: d.title,
        seoTitle: d.seoTitle,
        seoDescription: d.seoDescription,
        body: d.abstract ?? d.significance,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Show when={detail() === undefined}>
        <div class="siam-container py-12 text-ink-muted">Loading…</div>
      </Show>
      <Show when={detail() === null}>
        <div class="siam-container py-12">
          <Title>Publication not found</Title>
          <h1 class="text-2xl font-semibold text-brand-deep">Publication not found</h1>
          <p class="mt-4 text-secondary">
            No publication matches <code class="font-mono text-sm">{slug()}</code>.
          </p>
          <p class="mt-6">
            <A href="/publications" class="text-link font-medium no-underline hover:underline">
              ← All publications
            </A>
          </p>
        </div>
      </Show>
      <Show when={detail()}>
        {(dAccessor) => {
          const d = dAccessor();
          return (
            <>
              <Title>{pageMeta()?.title ?? d.title}</Title>
              <Meta name="description" content={pageMeta()?.description ?? ""} />
              <Meta property="og:title" content={pageMeta()?.ogTitle ?? d.title} />
              <Meta
                property="og:description"
                content={pageMeta()?.ogDescription ?? ""}
              />
              <PublicationPublicDetailView
                detail={d}
                backHref="/publications"
                backLabel="All publications"
                citation={citation() ?? null}
                citationLoading={citation() === undefined}
              />
            </>
          );
        }}
      </Show>
    </>
  );
}
