import { createSignal, For, Show } from "solid-js";
import type { WritingListSearchParams } from "~/lib/writing/writing-list-search-params";
import {
  clearWritingListFilters,
  setWritingListFilters,
} from "~/lib/writing/writing-list-search-params";

export type WritingListFiltersProps = {
  params: WritingListSearchParams;
  setSearchParams: (
    params: Record<string, string | undefined | null>,
    options?: { replace?: boolean },
  ) => void;
};

const SORT_OPTIONS: { value: WritingListSearchParams["sort"]; label: string }[] =
  [
    { value: "publishedAtDesc", label: "Newest first" },
    { value: "titleAsc", label: "Title (A–Z)" },
  ];

export default function WritingListFilters(props: WritingListFiltersProps) {
  const [qDraft, setQDraft] = createSignal(props.params.q ?? "");
  const [tagDraft, setTagDraft] = createSignal(props.params.tag ?? "");
  const [seriesDraft, setSeriesDraft] = createSignal(props.params.series ?? "");

  function applySearch() {
    setWritingListFilters(props.setSearchParams, {
      q: qDraft().trim() || undefined,
      tag: tagDraft().trim() || undefined,
      series: seriesDraft().trim() || undefined,
    });
  }

  return (
    <form
      class="flex flex-col gap-4 rounded-xl border border-border bg-surface-container-lowest p-4 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        applySearch();
      }}
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label class="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
          <span class="text-ink-muted">Search</span>
          <input
            type="search"
            name="q"
            class="siam-input"
            value={qDraft()}
            placeholder="Title, summary, slug…"
            onInput={(e) => setQDraft(e.currentTarget.value)}
          />
        </label>
        <label class="flex min-w-[10rem] flex-1 flex-col gap-1 text-sm">
          <span class="text-ink-muted">Tag</span>
          <input
            type="text"
            name="tag"
            class="siam-input"
            value={tagDraft()}
            placeholder="e.g. python"
            onInput={(e) => setTagDraft(e.currentTarget.value)}
          />
        </label>
        <label class="flex min-w-[10rem] flex-1 flex-col gap-1 text-sm">
          <span class="text-ink-muted">Series slug</span>
          <input
            type="text"
            name="series"
            class="siam-input"
            value={seriesDraft()}
            placeholder="e.g. ml-notes"
            onInput={(e) => setSeriesDraft(e.currentTarget.value)}
          />
        </label>
        <button type="submit" class="siam-btn-primary shrink-0">
          Apply
        </button>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Sort</span>
          <select
            name="sort"
            class="siam-input min-w-[12rem]"
            value={props.params.sort ?? "publishedAtDesc"}
            onChange={(e) => {
              const value = e.currentTarget.value as WritingListSearchParams["sort"];
              setWritingListFilters(props.setSearchParams, {
                sort: value === "publishedAtDesc" ? undefined : value,
              });
            }}
          >
            <For each={SORT_OPTIONS}>
              {(opt) => <option value={opt.value}>{opt.label}</option>}
            </For>
          </select>
        </label>
        <button
          type="button"
          class="siam-btn-secondary self-end text-sm"
          onClick={() => {
            setQDraft("");
            setTagDraft("");
            setSeriesDraft("");
            clearWritingListFilters(props.setSearchParams);
          }}
        >
          Reset filters
        </button>
      </div>
      <Show
        when={
          props.params.tag ||
          props.params.series ||
          (props.params.sort && props.params.sort !== "publishedAtDesc")
        }
      >
        <div class="flex flex-wrap gap-2">
          <Show when={props.params.tag}>
            {(tag) => (
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-xs"
                onClick={() =>
                  setWritingListFilters(props.setSearchParams, { tag: undefined })
                }
              >
                Tag: {tag()} ×
              </button>
            )}
          </Show>
          <Show when={props.params.series}>
            {(series) => (
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-xs"
                onClick={() =>
                  setWritingListFilters(props.setSearchParams, {
                    series: undefined,
                  })
                }
              >
                Series: {series()} ×
              </button>
            )}
          </Show>
          <Show
            when={
              props.params.sort && props.params.sort !== "publishedAtDesc"
            }
          >
            {(sort) => (
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-xs"
                onClick={() =>
                  setWritingListFilters(props.setSearchParams, { sort: undefined })
                }
              >
                Sort: {sort() === "titleAsc" ? "Title" : sort()} ×
              </button>
            )}
          </Show>
        </div>
      </Show>
    </form>
  );
}
