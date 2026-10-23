import type { PublicContactConfig } from "~/lib/api/types/contact.types";

export type ContactChannelsProps = {
  config: PublicContactConfig;
};

export default function ContactChannels(props: ContactChannelsProps) {
  const email = () => {
    if (!props.config.showEmailOnPage || !props.config.publicEmail?.trim()) {
      return null;
    }
    return props.config.publicEmail.trim();
  };

  return (
    <div class="space-y-3 text-ink-muted">
      {!props.config.formEnabled && (
        <p class="text-sm">
          The contact form is not available right now. Please use the channels
          below to reach out.
        </p>
      )}
      {email() && (
        <p class="text-sm">
          Email:{" "}
          <a class="text-link font-medium no-underline hover:underline" href={`mailto:${email()}`}>
            {email()}
          </a>
        </p>
      )}
    </div>
  );
}
