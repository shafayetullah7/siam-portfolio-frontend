import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import ApiStatus from "~/components/ApiStatus";
import { getPublicHome, getPublicSite } from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicHome();
  },
} satisfies RouteDefinition;

export default function Home() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const home = createAsync(() => getPublicHome(), { deferStream: true });

  const pageMeta = () => {
    const s = site();
    const h = home();
    if (!s || !h) return null;
    return buildPageMeta(
      {
        title: h.heroTitle ?? "Home",
        body: h.heroSubtitle ?? "",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <main id="main" class="siam-container py-12 sm:py-16">
      <Title>{pageMeta()?.title ?? "Home"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
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
        <p class="mt-8 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <A href="/design-preview" class="text-link">Design preview (dev)</A>
          <A href="/dev/error-boundary-test" class="text-link">Error boundary test (dev)</A>
        </p>
      </Show>
      <Show when={import.meta.env.DEV}>
        <ApiStatus />
      </Show>
    </main>
  );
}
