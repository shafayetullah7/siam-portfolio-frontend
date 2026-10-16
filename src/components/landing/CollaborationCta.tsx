import { A } from "@solidjs/router";
import { Show } from "solid-js";
import type { HomeCollaborationCta } from "~/content";

export type CollaborationCtaProps = {
  cta: HomeCollaborationCta;
};

export default function CollaborationCta(props: CollaborationCtaProps) {
  const { cta } = props;

  return (
    <section
      id="collaboration"
      class="scroll-mt-24 relative w-full overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-xl sm:p-10"
    >
      <div
        class="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full border border-primary-fixed/10"
        aria-hidden="true"
      />
      <div class="relative flex max-w-3xl flex-col gap-5">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-primary-fixed" aria-hidden="true" />
          <span class="siam-eyebrow font-semibold text-primary-fixed">
            Collaboration &amp; advisory inquiries
          </span>
        </div>
        <h2 class="siam-headline-lg font-normal leading-tight text-primary-foreground">
          {cta.headline}
        </h2>
        <p class="text-base leading-relaxed text-primary-fixed/90">{cta.body}</p>
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <A
            href={cta.href}
            class="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-fixed px-5 text-sm font-medium text-on-primary-fixed no-underline shadow transition-colors hover:bg-surface-container-lowest hover:text-brand-deep"
          >
            Send direct message
          </A>
          <Show when={cta.secondaryHref?.trim()}>
            <A
              href={cta.secondaryHref!}
              class="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-hover px-5 text-sm font-medium text-primary-foreground no-underline transition-colors"
            >
              {cta.secondaryLabel ?? "Schedule advisory chat"}
            </A>
          </Show>
          <Show when={cta.replyNote?.trim()}>
            <span class="font-mono text-xs text-primary-fixed/80">{cta.replyNote}</span>
          </Show>
        </div>
      </div>
    </section>
  );
}
