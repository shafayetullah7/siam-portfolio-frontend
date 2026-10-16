import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { getPublicAbout, getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicAbout();
  },
} satisfies RouteDefinition;

export default function About() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const about = createAsync(() => getPublicAbout(), { deferStream: true });

  const pageMeta = () => {
    const s = site();
    const a = about();
    if (!s || !a) return null;
    return buildPageMeta(
      {
        title: "About",
        seoDescription: a.shortBio,
        body: a.longBio ?? "",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <div class="siam-container py-12">
      <Title>{pageMeta()?.title ?? "About"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? "About"} />
      <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {about()?.headline ?? "About"}
      </h1>
      <p class="siam-prose mt-4 text-ink-muted">
        {about()?.longBio ?? about()?.shortBio ?? "Content from the CMS will appear here."}
      </p>
      {about()?.affiliation && (
        <p class="mt-4 text-sm text-ink-muted">{about()!.affiliation}</p>
      )}
      <p class="mt-6">
        <A href="/" class="text-link font-medium no-underline hover:underline">← Home</A>
      </p>
    </div>
  );
}
