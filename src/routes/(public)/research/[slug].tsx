import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import DetailStubLayout from "~/components/catalog/DetailStubLayout";
import { getResearchTheme } from "~/content";
import { getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
  },
} satisfies RouteDefinition;

export default function ResearchThemeDetail() {
  const params = useParams();
  const slug = () => params.slug ?? "";
  const theme = () => getResearchTheme(slug());
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const t = theme();
    const s = site();
    if (!t || !s) return null;
    return buildPageMeta(
      {
        title: t.title,
        seoDescription: t.description,
        body: t.problem ?? t.description,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Show
        when={theme()}
        fallback={
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
        }
      >
        {(tAccessor) => {
          const t = tAccessor();
          const tags = t.tags;
          return (
          <>
            <Title>{pageMeta()?.title ?? t.title}</Title>
            <Meta name="description" content={pageMeta()?.description ?? ""} />
            <Meta property="og:title" content={pageMeta()?.ogTitle ?? t.title} />
            <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
            <DetailStubLayout
              title={t.title}
              backHref="/research"
              backLabel="All research themes"
              relatedLinks={[
                { label: "Publications", href: "/publications" },
                { label: "Projects", href: "/projects" },
              ]}
              meta={
                <>
                  {t.status && <span class="capitalize">{t.status}</span>}
                  {tags && tags.length > 0 && (
                    <span class="mt-2 block">{tags.join(" · ")}</span>
                  )}
                </>
              }
            >
              <p>{t.description}</p>
              {t.problem && (
                <>
                  <h2 class="siam-headline-md mt-8 text-brand-deep">Problem</h2>
                  <p>{t.problem}</p>
                </>
              )}
              {t.approach && (
                <>
                  <h2 class="siam-headline-md mt-8 text-brand-deep">Approach</h2>
                  <p>{t.approach}</p>
                </>
              )}
              <p class="mt-8 text-sm text-on-surface-variant">
                Full theme page (P04) will expand citations, collaborators, and related work.
              </p>
            </DetailStubLayout>
          </>
          );
        }}
      </Show>
    </>
  );
}
