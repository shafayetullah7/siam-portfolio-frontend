import type { HomePublicationHighlight } from "~/content";
import LandingContentLink from "./LandingContentLink";

export type PublicationHighlightRowProps = {
  item: HomePublicationHighlight;
};

export default function PublicationHighlightRow(props: PublicationHighlightRowProps) {
  const { item } = props;

  return (
    <article class="siam-pub-row">
      <div class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <span class="siam-pill shrink-0">
          {item.venue} &apos;{String(item.year).slice(-2)}
        </span>
        <div class="min-w-0">
          <h3 class="font-serif text-lg font-medium leading-snug text-ink">
            <LandingContentLink
              href={item.href}
              ariaLabel={`View publication: ${item.title}`}
              class="text-ink no-underline hover:text-link hover:underline"
            >
              {item.title}
            </LandingContentLink>
          </h3>
          <p class="mt-1 text-sm text-ink-muted">{item.authorsShort}</p>
          <p class="mt-2 text-sm text-ink-muted">{item.significance}</p>
        </div>
      </div>
    </article>
  );
}
