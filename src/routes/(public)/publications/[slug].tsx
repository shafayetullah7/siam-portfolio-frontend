import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import DetailStubLayout from "~/components/catalog/DetailStubLayout";
import { getPublication } from "~/content";
import { getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
  },
} satisfies RouteDefinition;

export default function PublicationDetail() {
  const params = useParams();
  const slug = () => params.slug ?? "";
  const publication = () => getPublication(slug());
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const p = publication();
    const s = site();
    if (!p || !s) return null;
    return buildPageMeta(
      {
        title: p.title,
        seoDescription: p.significance,
        body: p.abstract ?? p.significance,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Show
        when={publication()}
        fallback={
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
        }
      >
        {(p) => (
          <>
            <Title>{pageMeta()?.title ?? p().title}</Title>
            <Meta name="description" content={pageMeta()?.description ?? ""} />
            <Meta property="og:title" content={pageMeta()?.ogTitle ?? p().title} />
            <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
            <DetailStubLayout
              title={p().title}
              backHref="/publications"
              backLabel="All publications"
              metaLines={[
                `${p().authorsShort} · ${p().venue} · ${p().year}`,
              ]}
            >
              <p class="font-medium text-ink">{p().significance}</p>
              {p().abstract && (
                <>
                  <h2 class="siam-headline-md mt-8 text-brand-deep">Abstract</h2>
                  <p>{p().abstract}</p>
                </>
              )}
              <p class="mt-8">
                <A
                  href={`/publications/${p().slug}`}
                  class="text-link font-medium no-underline hover:underline"
                >
                  Permalink
                </A>
              </p>
              <p class="mt-8 text-sm text-on-surface-variant">
                BibTeX export and full P06 detail will ship in a later phase.
              </p>
            </DetailStubLayout>
          </>
        )}
      </Show>
    </>
  );
}
