import type { HomePublicationHighlight } from "~/content";
import LandingContentLink from "./LandingContentLink";

export type PublicationHighlightRowProps = {
  item: HomePublicationHighlight;
};

export default function PublicationHighlightRow(props: PublicationHighlightRowProps) {
  const { item } = props;

  return (
    <article class="siam-pub-row">
      <div class="min-w-0 flex-1">
        <h3 class="text-base font-semibold text-ink">
          <LandingContentLink
            href={item.href}
            ariaLabel={`View publication: ${item.title}`}
            class="text-link no-underline hover:underline"
          >
            {item.title}
          </LandingContentLink>
        </h3>
        <p class="mt-1 text-sm text-ink-muted">
          {item.authorsShort} — {item.venue}, {item.year}
        </p>
        <p class="mt-2 text-sm text-ink-subtle">{item.significance}</p>
      </div>
    </article>
  );
}
