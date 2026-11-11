import { Show } from "solid-js";
import type { CollaborationPublicCard } from "~/lib/api/types/talks.types";

export type CollaborationCardProps = {
  item: CollaborationPublicCard;
};

export default function CollaborationCard(props: CollaborationCardProps) {
  const item = () => props.item;

  return (
    <article class="rounded-xl border border-border bg-surface-container-lowest p-6 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Show
          when={
            item().logo?.url &&
            (item().logo?.alt?.trim() ?? "") !== ""
          }
        >
          <img
              src={item().logo!.url}
              alt={item().logo!.alt.trim()}
              loading="lazy"
              decoding="async"
              class="h-14 w-auto max-w-[140px] object-contain"
            />
        </Show>
        <div class="min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-brand-deep">{item().partnerName}</h3>
          <Show when={item().institution?.trim()}>
            <p class="text-sm text-ink-muted">{item().institution}</p>
          </Show>
          <Show when={item().role?.trim() || item().period?.trim()}>
            <p class="mt-2 font-mono text-xs text-on-surface-variant">
              {[item().role?.trim(), item().period?.trim()].filter(Boolean).join(" · ")}
            </p>
          </Show>
          <p class="mt-3 text-sm text-secondary">{item().summary}</p>
          <Show when={item().outcomes?.trim()}>
            <p class="mt-2 text-sm text-ink">{item().outcomes}</p>
          </Show>
        </div>
      </div>
    </article>
  );
}
