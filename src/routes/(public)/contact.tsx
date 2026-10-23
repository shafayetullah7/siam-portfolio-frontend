import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import ContactPageContent from "~/components/contact/ContactPageContent";
import {
  getPublicContactConfig,
  getPublicSite,
} from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicContactConfig();
  },
} satisfies RouteDefinition;

export default function ContactPage() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const config = createAsync(() => getPublicContactConfig(), {
    deferStream: true,
  });

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    return buildPageMeta(
      {
        title: "Contact",
        seoDescription:
          "Get in touch for collaborations, speaking, and research inquiries.",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  return (
    <>
      <Title>{pageMeta()?.title ?? "Contact"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? "Contact"} />
      <Meta
        property="og:description"
        content={pageMeta()?.ogDescription ?? ""}
      />
      <CatalogPageShell
        title="Contact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      >
        <Show when={config()} fallback={<p class="text-ink-muted">Loading…</p>}>
          {(c) => <ContactPageContent config={c()} />}
        </Show>
      </CatalogPageShell>
    </>
  );
}
