import { createSignal } from "solid-js";
import type { PublicationType } from "~/lib/api/types/publication.types";
import { PUBLICATION_TYPES } from "~/lib/forms/schemas/publication-write.schema";
import type { PublicationListSearchParams } from "~/lib/publications/publication-list-search-params";
import {
  clearPublicationListFilters,
  setPublicationListFilters,
} from "~/lib/publications/publication-list-search-params";

export type PublicationThemeOption = {
  slug: string;
  title: string;
};

export type PublicationListFiltersProps = {
  params: PublicationListSearchParams;
  themeOptions: readonly PublicationThemeOption[];
  setSearchParams: (
    params: Record<string, string | undefined | null>,
    options?: { replace?: boolean },
  ) => void;
};

const TYPE_LABELS: Record<PublicationType, string> = {
  journal: "Journal",
  conference: "Conference",
  preprint: "Preprint",
  workshop: "Workshop",
  thesis: "Thesis",
  other: "Other",
};

export default function PublicationListFilters(props: PublicationListFiltersProps) {
  const [qDraft, setQDraft] = createSignal(props.params.q ?? "");

  function applySearch() {
    setPublicationListFilters(props.setSearchParams, {
      q: qDraft().trim() || undefined,
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
            placeholder="Title, author, keyword…"
            onInput={(e) => setQDraft(e.currentTarget.value)}
          />
        </label>
        <button type="submit" class="siam-btn-primary shrink-0">
          Apply
        </button>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Year</span>
          <input
            type="number"
            name="year"
            class="siam-input w-28"
            min={1900}
            max={2100}
            value={props.params.year ?? ""}
            onChange={(e) => {
              const value = e.currentTarget.value.trim();
              setPublicationListFilters(props.setSearchParams, {
                year: value || undefined,
              });
            }}
          />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Type</span>
          <select
            name="type"
            class="siam-input min-w-[10rem]"
            value={props.params.type ?? ""}
            onChange={(e) => {
              const value = e.currentTarget.value as PublicationType | "";
              setPublicationListFilters(props.setSearchParams, {
                type: value || undefined,
              });
            }}
          >
            <option value="">All types</option>
            {PUBLICATION_TYPES.map((type) => (
              <option value={type}>{TYPE_LABELS[type]}</option>
            ))}
          </select>
        </label>
        <label class="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
          <span class="text-ink-muted">Research theme</span>
          <select
            name="theme"
            class="siam-input"
            value={props.params.theme ?? ""}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setPublicationListFilters(props.setSearchParams, {
                theme: value || undefined,
              });
            }}
          >
            <option value="">All themes</option>
            {props.themeOptions.map((theme) => (
              <option value={theme.slug}>{theme.title}</option>
            ))}
          </select>
        </label>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          onClick={() => clearPublicationListFilters(props.setSearchParams)}
        >
          Reset filters
        </button>
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          onClick={() =>
            setPublicationListFilters(props.setSearchParams, {
              group: props.params.group === "year" ? undefined : "year",
            })
          }
        >
          {props.params.group === "year"
            ? "Ungroup by year"
            : "Group by year"}
        </button>
      </div>
    </form>
  );
}
