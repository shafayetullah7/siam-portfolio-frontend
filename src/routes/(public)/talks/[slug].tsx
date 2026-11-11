import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import TalkPublicDetailView from "~/components/talks/TalkPublicDetailView";
import { getPublicSite } from "~/lib/api/queries/public";
import { getPublicTalkBySlug } from "~/lib/api/queries/public/talks.queries";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: ({ params }) => {
    void getPublicSite();
    void getPublicTalkBySlug(params.slug ?? "");
  },
} satisfies RouteDefinition;

export default function TalkDetail() {
  const params = useParams();
  const slug = () => params.slug ?? "";
  const detail = createAsync(() => getPublicTalkBySlug(slug()), {
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
        body: d.description,
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
          <Title>Talk not found</Title>
          <h1 class="text-2xl font-semibold text-brand-deep">Talk not found</h1>
          <p class="mt-4 text-secondary">
            No talk matches <code class="font-mono text-sm">{slug()}</code>.
          </p>
          <p class="mt-6">
            <A href="/talks" class="text-link font-medium no-underline hover:underline">
              ← All talks
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
              <TalkPublicDetailView
                detail={d}
                backHref="/talks"
                backLabel="All talks"
              />
            </>
          );
        }}
      </Show>
    </>
  );
}
