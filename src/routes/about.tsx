import { A } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createResource } from "solid-js";
import { sitePublicApi } from "~/lib/api/endpoints/public/site.api";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export default function About() {
  const [site] = createResource(() => sitePublicApi.get());
  const [about] = createResource(() => sitePublicApi.about());

  const meta = () => {
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
    <main id="main" class="siam-container py-12">
      <Title>{meta()?.title ?? "About"}</Title>
      <Meta name="description" content={meta()?.description ?? ""} />
      <Meta property="og:title" content={meta()?.ogTitle ?? "About"} />
      <Meta property="og:description" content={meta()?.ogDescription ?? ""} />
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {about()?.headline ?? "About"}
      </h1>
      <p class="siam-prose mt-4 text-ink-muted">
        {about()?.longBio ?? about()?.shortBio ?? "Content from the CMS will appear here."}
      </p>
      {about()?.affiliation && (
        <p class="mt-4 text-sm text-ink-muted">{about().affiliation}</p>
      )}
      <p class="mt-6">
        <A href="/" class="text-link font-medium no-underline hover:underline">← Home</A>
      </p>
    </main>
  );
}
