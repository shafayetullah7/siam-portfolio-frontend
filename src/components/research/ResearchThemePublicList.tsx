import { A } from "@solidjs/router";
import { For, Show, createMemo, createSignal } from "solid-js";
import EmptyState from "~/components/EmptyState";
import ResearchFocusGrid from "~/components/landing/ResearchFocusGrid";
import { researchCardPublicToHomeItem } from "~/lib/research/research-card-mapper";
import {
  applyResearchListFilters,
  groupByThemeStatus,
  shouldGroupByStatus,
  shouldShowStatusFilters,
  shouldShowTagFilters,
  collectDistinctTags,
  type ThemeStatusFilter,
} from "~/lib/research/public-research-list";
import type { ResearchThemeCardPublic } from "~/lib/api/types/research.types";

export type ResearchThemePublicListProps = {
  cards: ResearchThemeCardPublic[];
};

function FilterChip(props: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      class={`rounded-full px-3 py-1 text-sm ${
        props.active
          ? "bg-primary text-primary-foreground"
          : "bg-surface-container text-ink-muted hover:bg-surface-container-high"
      }`}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

export default function ResearchThemePublicList(
  props: ResearchThemePublicListProps,
) {
  const cards = () => props.cards;
  const [statusFilter, setStatusFilter] = createSignal<ThemeStatusFilter>("all");
  const [tagFilter, setTagFilter] = createSignal<string | null>(null);

  const filtered = createMemo(() =>
    applyResearchListFilters(cards(), statusFilter(), tagFilter()),
  );

  const tags = createMemo(() => collectDistinctTags(cards()));

  return (
    <Show
      when={cards().length > 0}
      fallback={
        <EmptyState
          variant="list"
          title="No research themes yet"
          description="Published themes will appear here. In the meantime, explore publications and projects."
        >
          <div class="flex flex-wrap justify-center gap-2">
            <A href="/publications" class="siam-btn-secondary no-underline">
              Publications
            </A>
            <A href="/projects" class="siam-btn-secondary no-underline">
              Projects
            </A>
          </div>
        </EmptyState>
      }
    >
      <Show when={shouldShowStatusFilters(cards())}>
        <div class="mb-4 flex flex-wrap gap-2">
          <FilterChip
            label="All"
            active={statusFilter() === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <FilterChip
            label="Ongoing"
            active={statusFilter() === "ongoing"}
            onClick={() => setStatusFilter("ongoing")}
          />
          <FilterChip
            label="Completed"
            active={statusFilter() === "completed"}
            onClick={() => setStatusFilter("completed")}
          />
        </div>
      </Show>
      <Show when={shouldShowTagFilters(cards())}>
        <div class="mb-6 flex flex-wrap gap-2">
          <FilterChip
            label="All topics"
            active={tagFilter() === null}
            onClick={() => setTagFilter(null)}
          />
          <For each={tags()}>
            {(tag) => (
              <FilterChip
                label={tag}
                active={tagFilter() === tag}
                onClick={() => setTagFilter(tag)}
              />
            )}
          </For>
        </div>
      </Show>

      <Show
        when={shouldGroupByStatus(filtered()) && statusFilter() === "all" && !tagFilter()}
        fallback={
          <ResearchFocusGrid
            items={filtered().map(researchCardPublicToHomeItem)}
          />
        }
      >
        {() => {
          const { ongoing, completed } = groupByThemeStatus(filtered());
          return (
            <div class="space-y-10">
              <Show when={ongoing.length > 0}>
                <section>
                  <h2 class="siam-headline-md mb-4 text-brand-deep">
                    Ongoing themes
                  </h2>
                  <ResearchFocusGrid
                    items={ongoing.map(researchCardPublicToHomeItem)}
                  />
                </section>
              </Show>
              <Show when={completed.length > 0}>
                <section>
                  <h2 class="siam-headline-md mb-4 text-brand-deep">
                    Completed themes
                  </h2>
                  <ResearchFocusGrid
                    items={completed.map(researchCardPublicToHomeItem)}
                  />
                </section>
              </Show>
            </div>
          );
        }}
      </Show>
    </Show>
  );
}
