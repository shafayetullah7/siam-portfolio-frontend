import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import CatalogPageShell from "~/components/catalog/CatalogPageShell";
import CollaborationsPage from "~/components/collaborations/CollaborationsPage";
import EmptyState from "~/components/EmptyState";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";
import {
  getPublicCollaborationsPage,
  getPublicSite,
} from "~/lib/api/queries/public";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicCollaborationsPage();
  },
} satisfies RouteDefinition;

export default function CollaborationsIndex() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const page = createAsync(() => getPublicCollaborationsPage(), {
    deferStream: true,
  });

  const pageMeta = () => {
    const s = site();
    if (!s) return null;
    const intro =
      page()?.intro?.trim() ??
      "Selected partnerships and academic service roles.";
    return buildPageMeta(
      {
        title: "Collaborations",
        seoDescription: intro,
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  const hubIntro = () => {
    const data = page();
    if (data?.intro?.trim()) return data.intro.trim();
    return "Selected partnerships and academic service roles.";
  };

  const isUnavailable = () => {
    const data = page();
    if (data === undefined) return false;
    return !data.pageEnabled;
  };

  return (
    <>
      <Show when={page() !== undefined && isUnavailable()}>
        <div class={PUBLIC_PAGE_WIDE}>
          <Title>Page not found</Title>
          <EmptyState
            title="Page not found"
            description="The address may be wrong, or the page may have moved."
          />
        </div>
      </Show>
      <Show when={page()}>
        {(pageData) => (
          <Show when={!isUnavailable()}>
            <>
              <Title>{pageMeta()?.title ?? "Collaborations"}</Title>
              <Meta name="description" content={pageMeta()?.description ?? ""} />
              <Meta
                property="og:title"
                content={pageMeta()?.ogTitle ?? "Collaborations"}
              />
              <Meta
                property="og:description"
                content={pageMeta()?.ogDescription ?? ""}
              />
              <CatalogPageShell
                wide
                title="Collaborations"
                intro={hubIntro()}
                breadcrumbs={[
                  { label: "Home", href: "/" },
                  { label: "Collaborations" },
                ]}
              >
                <CollaborationsPage data={pageData()} />
              </CatalogPageShell>
            </>
          </Show>
        )}
      </Show>
    </>
  );
}
