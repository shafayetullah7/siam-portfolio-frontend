import { createSignal, For, Show } from "solid-js";
import type { ProjectStatus, ProjectType } from "~/lib/api/types/project.types";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_TYPE_LABELS,
} from "~/lib/projects/projectLabels";
import type { ProjectListSearchParams } from "~/lib/projects/project-list-search-params";
import {
  clearProjectListFilters,
  setProjectListFilters,
} from "~/lib/projects/project-list-search-params";

export type ProjectListFiltersProps = {
  params: ProjectListSearchParams;
  setSearchParams: (
    params: Record<string, string | undefined | null>,
    options?: { replace?: boolean },
  ) => void;
};

const PROJECT_TYPES = Object.keys(PROJECT_TYPE_LABELS) as ProjectType[];
const PROJECT_STATUSES = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

export default function ProjectListFilters(props: ProjectListFiltersProps) {
  const [qDraft, setQDraft] = createSignal(props.params.q ?? "");
  const [tagDraft, setTagDraft] = createSignal(props.params.tag ?? "");

  function applySearch() {
    setProjectListFilters(props.setSearchParams, {
      q: qDraft().trim() || undefined,
      tag: tagDraft().trim() || undefined,
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
        <button type="submit" class="siam-btn-primary shrink-0">
          Apply
        </button>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Type</span>
          <select
            name="type"
            class="siam-input min-w-[12rem]"
            value={props.params.type ?? ""}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setProjectListFilters(props.setSearchParams, {
                type: value ? (value as ProjectType) : undefined,
              });
            }}
          >
            <option value="">All types</option>
            <For each={PROJECT_TYPES}>
              {(type) => (
                <option value={type}>{PROJECT_TYPE_LABELS[type]}</option>
              )}
            </For>
          </select>
        </label>
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Status</span>
          <select
            name="status"
            class="siam-input min-w-[12rem]"
            value={props.params.status ?? ""}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setProjectListFilters(props.setSearchParams, {
                status: value ? (value as ProjectStatus) : undefined,
              });
            }}
          >
            <option value="">All statuses</option>
            <For each={PROJECT_STATUSES}>
              {(status) => (
                <option value={status}>{PROJECT_STATUS_LABELS[status]}</option>
              )}
            </For>
          </select>
        </label>
        <button
          type="button"
          class="siam-btn-secondary self-end text-sm"
          onClick={() => {
            setQDraft("");
            setTagDraft("");
            clearProjectListFilters(props.setSearchParams);
          }}
        >
          Reset filters
        </button>
      </div>
      <Show
        when={
          props.params.type || props.params.status || props.params.tag
        }
      >
        <div class="flex flex-wrap gap-2">
          <Show when={props.params.type}>
            {(type) => (
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-xs"
                onClick={() =>
                  setProjectListFilters(props.setSearchParams, { type: undefined })
                }
              >
                Type: {PROJECT_TYPE_LABELS[type()]} ×
              </button>
            )}
          </Show>
          <Show when={props.params.status}>
            {(status) => (
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-xs"
                onClick={() =>
                  setProjectListFilters(props.setSearchParams, {
                    status: undefined,
                  })
                }
              >
                Status: {PROJECT_STATUS_LABELS[status()]} ×
              </button>
            )}
          </Show>
          <Show when={props.params.tag}>
            {(tag) => (
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-xs"
                onClick={() =>
                  setProjectListFilters(props.setSearchParams, { tag: undefined })
                }
              >
                Tag: {tag()} ×
              </button>
            )}
          </Show>
        </div>
      </Show>
    </form>
  );
}
