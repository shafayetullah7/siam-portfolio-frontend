import { A } from "@solidjs/router";
import { Show } from "solid-js";
import {
  ABOUT_CONTACT_SECTION_ID,
  SCROLL_MT_BELOW_PUBLIC_HEADER,
} from "~/lib/site/homeSectionIds";
import type { AboutPageViewModel } from "~/lib/api/public/mapPublicAboutToViewModel";

export type AboutCollaborationSectionProps = {
  model: AboutPageViewModel;
};

export default function AboutCollaborationSection(
  props: AboutCollaborationSectionProps,
) {
  return (
    <section
      id={ABOUT_CONTACT_SECTION_ID}
      class={`mt-12 border-t border-border pt-10 ${SCROLL_MT_BELOW_PUBLIC_HEADER}`}
      aria-labelledby="about-contact-heading"
    >
      <h2 id="about-contact-heading" class="siam-headline-md text-brand-deep">
        Collaboration & contact
      </h2>
      <Show when={props.model.collaborationInterests}>
        <p class="siam-prose mt-3 max-w-prose text-ink-muted">
          {props.model.collaborationInterests}
        </p>
      </Show>
      <Show when={props.model.contactEmail}>
        <p class="mt-4 text-sm">
          <a
            href={`mailto:${props.model.contactEmail}`}
            class="text-link font-medium no-underline hover:underline"
          >
            {props.model.contactEmail}
          </a>
        </p>
      </Show>
      <p class="mt-4">
        <A href="/contact" class="text-link font-medium no-underline hover:underline">
          Go to the contact page
        </A>
      </p>
    </section>
  );
}
