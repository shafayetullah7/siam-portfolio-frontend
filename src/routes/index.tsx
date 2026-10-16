import { A } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createResource, Show } from "solid-js";
import ApiStatus from "~/components/ApiStatus";
import { sitePublicApi } from "~/lib/api/endpoints/public/site.api";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export default function Home() {
  const [site] = createResource(() => sitePublicApi.get());
  const [home] = createResource(() => sitePublicApi.home());

  const meta = () => {
    const s = site();
    const h = home();
    if (!s) return null;
    return buildPageMeta(
      {
        title: h?.heroTitle ?? "Home",
        body: h?.heroSubtitle ?? "",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <main id="main" class="siam-container py-12 sm:py-16">
      <Title>{meta()?.title ?? "Home"}</Title>
      <Meta name="description" content={meta()?.description ?? ""} />
      <p class="siam-label mb-4">Portfolio</p>
      <h1 class="max-w-3xl text-[clamp(2.5rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">
        {home()?.heroTitle ?? (
          <>
            A curious mind. A builder of{" "}
            <span class="text-primary">thoughtful AI.</span>
          </>
        )}
      </h1>
      <p class="siam-prose mt-6 text-ink-muted">
        {home()?.heroSubtitle ??
          "Organic Tech palette: warm canvas, teal actions, peach and mint accents."}
      </p>
      <div class="mt-10 flex flex-wrap gap-3">
        <A href="/about" class="siam-btn-primary no-underline">About</A>
        <button type="button" class="siam-btn-secondary">Contact</button>
      </div>
      <Show when={import.meta.env.DEV}>
        <p class="mt-8 text-sm">
          <A href="/design-preview" class="text-link">Open design preview (dev)</A>
        </p>
      </Show>
      <ApiStatus />
    </main>
  );
}
