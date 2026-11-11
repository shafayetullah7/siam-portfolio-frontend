import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta, Link } from "@solidjs/meta";
import { Show } from "solid-js";
import ApiStatus from "~/components/ApiStatus";
import LandingPage from "~/components/landing/LandingPage";
import { homeContent } from "~/content";
import { mapPublicHomeToContent } from "~/lib/api/public/mapPublicHomeToContent";
import { getPublicHome, getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";
import { getSiteOrigin } from "~/lib/site/siteOrigin";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicHome();
  },
} satisfies RouteDefinition;

export default function Home() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const homeApi = createAsync(() => getPublicHome(), { deferStream: true });

  const landingContent = () =>
    mapPublicHomeToContent(homeApi(), homeContent);

  const pageMeta = () => {
    const s = site();
    const api = homeApi();
    if (!s) return null;
    const published = Boolean(api?.published);
    const seo =
      published && api?.seo ? api.seo : homeContent.seo;
    const fallbackTitle = published
      ? landingContent().hero.name
      : s.siteName;
    const fallbackBody = published
      ? landingContent().hero.positioning
      : s.defaultMetaDescription;
    return buildPageMeta(
      {
        title: seo?.title?.trim() || fallbackTitle,
        seoTitle: seo?.title,
        seoDescription: seo?.description,
        body: seo?.description?.trim() || fallbackBody,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  const metaFallbackTitle = () => {
    const s = site();
    return homeApi()?.published
      ? landingContent().hero.name
      : (s?.siteName ?? "Home");
  };

  const canonicalUrl = () => `${getSiteOrigin()}/`;

  return (
    <>
      <Title>{pageMeta()?.title ?? metaFallbackTitle()}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? metaFallbackTitle()} />
      <Meta
        property="og:description"
        content={pageMeta()?.ogDescription ?? pageMeta()?.description ?? ""}
      />
      <Link rel="canonical" href={canonicalUrl()} />
      <LandingPage
        content={landingContent()}
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
