import { A } from "@solidjs/router";
import type { HomeCollaborationCta } from "~/content";

export type CollaborationCtaProps = {
  cta: HomeCollaborationCta;
};

export default function CollaborationCta(props: CollaborationCtaProps) {
  const { cta } = props;

  return (
    <section
      id="collaboration"
      class="scroll-mt-20 rounded-lg bg-surface-muted px-6 py-10 sm:px-8"
    >
      <h2 class="siam-headline-md">{cta.headline}</h2>
      <p class="mt-3 text-ink-muted">{cta.body}</p>
      <A href={cta.href} class="siam-btn-primary mt-6 inline-flex no-underline">
        Contact
      </A>
    </section>
  );
}
