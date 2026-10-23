import { Show } from "solid-js";
import type { PublicContactConfig } from "~/lib/api/types/contact.types";
import { DEFAULT_CONTACT_INTRO } from "~/lib/contact/default-contact-intro";
import ContactChannels from "./ContactChannels";
import ContactForm from "./ContactForm";

export type ContactPageContentProps = {
  config: PublicContactConfig;
};

export default function ContactPageContent(props: ContactPageContentProps) {
  const intro = () => props.config.intro?.trim() || DEFAULT_CONTACT_INTRO;

  return (
    <div class="max-w-3xl">
      <p class="siam-prose text-ink-muted">{intro()}</p>

      <Show when={props.config.collaborationGuidance?.trim()}>
        <p class="siam-prose mt-4 text-ink-muted">
          {props.config.collaborationGuidance}
        </p>
      </Show>

      <Show when={props.config.responseTimeNote?.trim()}>
        <p class="mt-4 text-sm text-ink-muted">{props.config.responseTimeNote}</p>
      </Show>

      <div class="mt-6">
        <ContactChannels config={props.config} />
      </div>

      <Show when={props.config.formEnabled}>
        <ContactForm config={props.config} />
      </Show>
    </div>
  );
}
