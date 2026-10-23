import { A, createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import TimelinePublicDetailView from "~/components/timeline/TimelinePublicDetailView";
import {
  getPublicAchievementBySlug,
  getPublicSite,
} from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: ({ params }) => {
    void getPublicSite();
    void getPublicAchievementBySlug(params.slug);
  },
} satisfies RouteDefinition;

export default function AchievementDetail() {
  const params = useParams();
  const slug = () => params.slug ?? "";
  const detail = createAsync(() => getPublicAchievementBySlug(slug()), {
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
        body: d.summary,
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
          <Title>Achievement not found</Title>
          <h1 class="text-2xl font-semibold text-brand-deep">
            Achievement not found
          </h1>
          <p class="mt-4 text-secondary">
            No achievement matches{" "}
            <code class="font-mono text-sm">{slug()}</code>.
          </p>
          <p class="mt-6">
            <A
              href="/achievements"
              class="text-link font-medium no-underline hover:underline"
            >
              ← All achievements
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
              <div class="siam-container py-10">
                <TimelinePublicDetailView
                  detail={d}
                  backHref="/achievements"
                  backLabel="All achievements"
                />
              </div>
            </>
          );
        }}
      </Show>
    </>
  );
}
