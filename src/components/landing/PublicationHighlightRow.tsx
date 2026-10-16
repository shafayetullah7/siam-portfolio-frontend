import type { HomePublicationHighlight } from "~/content";
import LandingContentLink from "./LandingContentLink";

export type PublicationHighlightRowProps = {
  item: HomePublicationHighlight;
};

export default function PublicationHighlightRow(props: PublicationHighlightRowProps) {
  const { item } = props;
  const yearShort = () => String(item.year).slice(-2);

  return (
    <article
      class="flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-surface-container-low/40 sm:p-6 lg:flex-row lg:items-start"
    >
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <span class="rounded bg-primary px-2 py-0.5 font-mono text-xs font-semibold text-primary-foreground">
            {item.venue} &apos;{yearShort()}
          </span>
        </div>
        <h3 class="siam-headline-md mb-2 leading-snug font-medium text-brand-deep">
          <LandingContentLink
            href={item.href}
            ariaLabel={`View publication: ${item.title}`}
            class="text-brand-deep no-underline hover:text-link hover:underline"
          >
            {item.title}
          </LandingContentLink>
        </h3>
        <p class="mb-2 text-sm text-on-surface-variant">{item.authorsShort}</p>
        <div
          class="flex items-start gap-2 rounded-lg bg-surface-container-low p-2.5 text-sm italic text-secondary"
        >
          <span class="text-primary not-italic" aria-hidden="true">◆</span>
          <span>{item.significance}</span>
        </div>
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
        <LandingContentLink
          href={item.href}
          ariaLabel={`PDF for ${item.title}`}
          class="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 font-mono text-xs text-primary-foreground no-underline transition-colors hover:bg-primary-hover"
        >
          PDF
        </LandingContentLink>
      </div>
    </article>
  );
}
