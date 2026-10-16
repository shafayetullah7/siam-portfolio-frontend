import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import DetailStubLayout from "~/components/catalog/DetailStubLayout";
import { getProject } from "~/content";
import { getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
  },
} satisfies RouteDefinition;

export default function ProjectDetail() {
  const params = useParams();
  const slug = () => params.slug ?? "";
  const project = () => getProject(slug());
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const p = project();
    const s = site();
    if (!p || !s) return null;
    return buildPageMeta(
      {
        title: p.title,
        seoDescription: p.summary,
        body: p.body ?? p.summary,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Show
        when={project()}
        fallback={
          <div class="siam-container py-12">
            <Title>Project not found</Title>
            <h1 class="text-2xl font-semibold text-brand-deep">Project not found</h1>
            <p class="mt-4 text-secondary">
              No project matches <code class="font-mono text-sm">{slug()}</code>.
            </p>
            <p class="mt-6">
              <A href="/projects" class="text-link font-medium no-underline hover:underline">
                ← All projects
              </A>
            </p>
          </div>
        }
      >
        {(pAccessor) => {
          const p = pAccessor();
          const tags = p.tags;
          return (
          <>
            <Title>{pageMeta()?.title ?? p.title}</Title>
            <Meta name="description" content={pageMeta()?.description ?? ""} />
            <Meta property="og:title" content={pageMeta()?.ogTitle ?? p.title} />
            <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
            <DetailStubLayout
              title={p.title}
              backHref="/projects"
              backLabel="All projects"
              meta={
                tags && tags.length > 0 ? (
                  <span>{tags.join(" · ")}</span>
                ) : undefined
              }
            >
              <p>{p.summary}</p>
              {p.body && <p class="mt-4">{p.body}</p>}
              {p.href && (
                <p class="mt-8">
                  <A
                    href={p.href}
                    class="text-link font-medium no-underline hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    External repository / demo
                  </A>
                </p>
              )}
              <p class="mt-8 text-sm text-on-surface-variant">
                Full project page (P08) will add evaluation, contributors, and artifacts.
              </p>
            </DetailStubLayout>
          </>
          );
        }}
      </Show>
    </>
  );
}
