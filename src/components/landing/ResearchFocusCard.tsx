import { A } from "@solidjs/router";
import type { HomeResearchFocusItem } from "~/content";

export type ResearchFocusCardProps = {
  item: HomeResearchFocusItem;
};

export default function ResearchFocusCard(props: ResearchFocusCardProps) {
  const { item } = props;

  return (
    <A
      href={item.href}
      aria-label={`Research area: ${item.title}`}
      class="siam-card siam-card-interactive block h-full p-5 no-underline"
    >
      <h3 class="font-serif text-lg font-medium text-ink">{item.title}</h3>
      <p class="mt-2 text-sm text-ink-muted">{item.description}</p>
      <span class="mt-4 inline-block text-sm font-medium text-link">Read more</span>
    </A>
  );
}
