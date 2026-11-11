import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import AboutCollaborationSection from "~/components/about/AboutCollaborationSection";
import AboutPublishedContent from "~/components/about/AboutPublishedContent";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";
import ExperienceTimelineSection from "~/components/timeline/ExperienceTimelineSection";
import {
  getPublicAbout,
  getPublicExperience,
  getPublicSite,
} from "~/lib/api/queries/public";
import { mapPublicAboutToViewModel } from "~/lib/api/public/mapPublicAboutToViewModel";
import { DEFAULT_EXPERIENCE_HUB_INTRO } from "~/lib/timeline/default-experience-hub-intro";
import { buildPageMeta } from "~/lib/meta/buildPageMeta";

export const route = {
  preload: () => {
    void getPublicSite();
    void getPublicAbout();
    void getPublicExperience({ sort: "sortOrderAsc" });
  },
} satisfies RouteDefinition;

export default function About() {
  const site = createAsync(() => getPublicSite(), { deferStream: true });
  const aboutApi = createAsync(() => getPublicAbout(), { deferStream: true });
  const experience = createAsync(
    () => getPublicExperience({ sort: "sortOrderAsc" }),
    { deferStream: true },
  );

  const viewModel = () => mapPublicAboutToViewModel(aboutApi());

  const experienceIntro = () => {
    const data = experience();
    if (data?.intro?.trim()) return data.intro.trim();
    return DEFAULT_EXPERIENCE_HUB_INTRO;
  };

  const pageMeta = () => {
    const s = site();
    const vm = viewModel();
    if (!s) return null;
  if (vm.published) {
    return buildPageMeta(
      {
        title: vm.title,
        seoDescription: vm.shortBio ?? undefined,
        body: vm.longBio ?? vm.shortBio ?? "",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  }
    return buildPageMeta(
      {
        title: "About",
        seoDescription: s.defaultMetaDescription,
        body: "",
      },
      { siteName: s.siteName, defaultMetaDescription: s.defaultMetaDescription },
    );
  };

  const contactFooterModel = () => ({
    ...viewModel(),
    published: true,
    showCollaboration: true,
    collaborationInterests: null,
    contactEmail: null,
  });

  return (
    <div class={PUBLIC_PAGE_WIDE}>
      <Title>{pageMeta()?.title ?? "About"}</Title>
      <Meta name="description" content={pageMeta()?.description ?? ""} />
      <Meta property="og:title" content={pageMeta()?.ogTitle ?? "About"} />
      <Meta property="og:description" content={pageMeta()?.ogDescription ?? ""} />
      <AboutPublishedContent model={viewModel()} />
      <Show when={experience()}>
        {(hub) => (
          <ExperienceTimelineSection
            sections={hub().sections}
            intro={experienceIntro()}
          />
        )}
      </Show>
      <Show when={!viewModel().published || !viewModel().showCollaboration}>
        <AboutCollaborationSection model={contactFooterModel()} />
      </Show>
      <p class="mt-6">
        <A href="/" class="text-link font-medium no-underline hover:underline">← Home</A>
      </p>
    </div>
  );
}
