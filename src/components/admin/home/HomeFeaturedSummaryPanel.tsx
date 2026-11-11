import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import type {
  HomeFeaturedKind,
  HomeFeaturedSummaryItem,
  HomeFeaturedSummaryResponse,
} from "~/lib/api/types/home.types";

export type HomeFeaturedSummaryPanelProps = {
  summary: HomeFeaturedSummaryResponse | undefined;
  loading?: boolean;
};

function adminHref(kind: HomeFeaturedKind, id: string): string {
  switch (kind) {
    case "research":
      return `/admin/research/${id}`;
    case "publication":
      return `/admin/publications/${id}`;
    case "project":
      return `/admin/projects/${id}`;
  }
}

type GroupConfig = {
  key: keyof Pick<
    HomeFeaturedSummaryResponse,
    "research" | "publications" | "projects"
  >;
  title: string;
};

const GROUPS: GroupConfig[] = [
  { key: "research", title: "Research focus" },
  { key: "publications", title: "Selected publications" },
  { key: "projects", title: "Featured projects" },
];

function GroupSection(props: {
  title: string;
  cap: number;
  items: HomeFeaturedSummaryItem[];
}) {
  return (
    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-ink">
        {props.title} ({props.items.length}/{props.cap})
      </h3>
      <Show
        when={props.items.length > 0}
        fallback={
          <p class="text-sm text-ink-muted">No items flagged for this section.</p>
        }
      >
        <ul class="m-0 list-none space-y-2 p-0">
          <For each={props.items}>
            {(item) => (
              <li
                class={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 ${
                  item.appearsOnPublicHome
                    ? "border-border bg-surface-container-low"
                    : "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30"
                }`}
              >
                <A
                  href={adminHref(item.kind, item.id)}
                  class="text-sm font-medium text-link no-underline hover:underline"
                >
                  {item.title}
                </A>
                <div class="flex items-center gap-2">
                  <PublishStatusBadge status={item.publishStatus} />
                  <Show when={!item.appearsOnPublicHome}>
                    <span class="text-xs font-medium text-amber-800 dark:text-amber-200">
                      Omitted on /
                    </span>
                  </Show>
                </div>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}

export default function HomeFeaturedSummaryPanel(
  props: HomeFeaturedSummaryPanelProps,
) {
  const summary = () => props.summary;
  return (
    <section
      class="rounded-lg border border-border bg-surface-container-lowest p-4"
      aria-labelledby="home-featured-summary-heading"
    >
      <h2
        id="home-featured-summary-heading"
        class="text-lg font-semibold text-ink"
      >
        Featured on home
      </h2>
      <p class="mt-1 text-sm text-ink-muted">
        Read-only summary. Toggle <strong>Featured on home</strong> in Research,
        Publications, or Projects editors. Unpublished picks are omitted on{" "}
        <code class="text-xs">/</code> and flagged at homepage publish.
      </p>
      <Show when={props.loading}>
        <p class="mt-4 text-sm text-ink-muted">Loading featured picks…</p>
      </Show>
      <Show when={!props.loading && summary()}>
        {(data) => (
          <div class="mt-4 grid gap-6">
            <For each={GROUPS}>
              {(group) => (
                <GroupSection
                  title={group.title}
                  cap={data().caps[group.key]}
                  items={data()[group.key]}
                />
              )}
            </For>
          </div>
        )}
      </Show>
    </section>
  );
}
