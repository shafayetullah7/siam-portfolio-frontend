import { A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Show } from "solid-js";
import { PUBLIC_PAGE_WIDE } from "~/components/layout/publicPageWidth";
import ExperienceTimelineSection from "~/components/timeline/ExperienceTimelineSection";
import {
  getPublicAbout,
  getPublicExperience,
  getPublicSite,
} from "~/lib/api/queries/public";
import { DEFAULT_EXPERIENCE_HUB_INTRO } from "~/lib/timeline/default-experience-hub-intro";
import {
  ABOUT_CONTACT_SECTION_ID,
  SCROLL_MT_BELOW_PUBLIC_HEADER,
} from "~/lib/site/homeSectionIds";
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
  const about = createAsync(() => getPublicAbout(), { deferStream: true });
  const experience = createAsync(
    () => getPublicExperience({ sort: "sortOrderAsc" }),
    { deferStream: true },
  );

  const experienceIntro = () => {
    const data = experience();
    if (data?.intro?.trim()) return data.intro.trim();
    return DEFAULT_EXPERIENCE_HUB_INTRO;
  };

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
    <div class={PUBLIC_PAGE_WIDE}>
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
      <Show when={experience()}>
        {(hub) => (
          <ExperienceTimelineSection
            sections={hub().sections}
            intro={experienceIntro()}
          />
        )}
      </Show>
      <section
        id={ABOUT_CONTACT_SECTION_ID}
        class={`mt-12 border-t border-border pt-10 ${SCROLL_MT_BELOW_PUBLIC_HEADER}`}
        aria-labelledby="about-contact-heading"
      >
        <h2 id="about-contact-heading" class="siam-headline-md text-brand-deep">
          Contact
        </h2>
        <p class="siam-prose mt-3 max-w-prose text-ink-muted">
          Reach out for collaborations, speaking, or student inquiries.
        </p>
        <p class="mt-4">
          <A href="/contact" class="text-link font-medium no-underline hover:underline">
            Go to the contact page
          </A>
        </p>
      </section>
      <p class="mt-6">
        <A href="/" class="text-link font-medium no-underline hover:underline">← Home</A>
      </p>
    </div>
  );
}
