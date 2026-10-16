import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta, Link } from "@solidjs/meta";
import { Show } from "solid-js";
import ApiStatus from "~/components/ApiStatus";
import LandingPage from "~/components/landing/LandingPage";
import { homeContent } from "~/content";
import { getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import { getSiteOrigin } from "~/lib/site/siteOrigin";

export const route = {
  preload: () => {
    void getPublicSite();
  },
} satisfies RouteDefinition;

export default function Home() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    const seo = homeContent.seo;
    return buildPageMeta(
      {
        title: seo?.title?.trim() || homeContent.hero.name,
        seoTitle: seo?.title,
        seoDescription: seo?.description,
        body: seo?.description?.trim() || homeContent.hero.positioning,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  const canonicalUrl = () => `${getSiteOrigin()}/`;

  return (
    <>
      <Title>{pageMeta()?.title ?? homeContent.hero.name}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? homeContent.hero.name} />
      <Meta
        property="og:description"
        content={pageMeta()?.ogDescription ?? pageMeta()?.description ?? ""}
      />
      <Link rel="canonical" href={canonicalUrl()} />
      <LandingPage
        content={homeContent}
        devFooter={
          <Show when={import.meta.env.DEV}>
            <div class="flex flex-col gap-4 border-t border-border pt-8">
              <p class="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <A href="/design-preview" class="text-link">Design preview (dev)</A>
                <A href="/dev/error-boundary-test" class="text-link">
                  Error boundary test (dev)
                </A>
              </p>
              <ApiStatus />
            </div>
          </Show>
        }
      />
    </>
  );
}
