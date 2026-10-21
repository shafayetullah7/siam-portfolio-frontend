import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
  type JSX,
} from "solid-js";
import EmptyState from "~/components/EmptyState";
import FormTextInput from "~/components/forms/FormTextInput";
import ResourceRequest from "~/components/ResourceRequest";
import { adminMediaApi } from "~/lib/api/endpoints/admin/media.api";
import type { MediaAdmin, MediaListResponse } from "~/lib/api/types/admin.types";
import MediaLibraryGrid from "./MediaLibraryGrid";
import {
  IMAGE_MIME_FILTER_OPTIONS,
  MEDIA_LIBRARY_PAGE_LIMIT,
  MIME_FILTER_OPTIONS,
} from "./media-library.constants";

export type MediaLibraryBrowserProps = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  imagesOnly?: boolean;
  mimeFilterOptions?: { value: string; label: string }[];
  pageLimit?: number;
  onListLoaded?: (data: MediaListResponse) => void;
  compact?: boolean;
  /** Increment to refetch the list (e.g. after upload). */
  refreshKey?: number;
  emptyFallback?: JSX.Element;
};

export default function MediaLibraryBrowser(props: MediaLibraryBrowserProps) {
  const [searchInput, setSearchInput] = createSignal("");
  const [debouncedQ, setDebouncedQ] = createSignal("");
  const [mimeFilter, setMimeFilter] = createSignal("");
  const [page, setPage] = createSignal(1);

  const pageLimit = () => props.pageLimit ?? MEDIA_LIBRARY_PAGE_LIMIT;
  const mimeOptions = () =>
    props.mimeFilterOptions ??
    (props.imagesOnly ? IMAGE_MIME_FILTER_OPTIONS : MIME_FILTER_OPTIONS);

  createEffect(() => {
    const value = searchInput();
    const timer = setTimeout(() => {
      setDebouncedQ(value.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  });

  const listResource = createResource(
    () => ({
      q: debouncedQ() || undefined,
      mime: mimeFilter() || undefined,
      imagesOnly: props.imagesOnly || undefined,
      page: page(),
      limit: pageLimit(),
      refreshKey: props.refreshKey ?? 0,
    }),
    (params) => adminMediaApi.list(params),
  );

  const hasActiveFilters = () => Boolean(debouncedQ() || mimeFilter());

  function onMimeChange(value: string) {
    setMimeFilter(value);
    setPage(1);
  }

  return (
    <ResourceRequest
      resource={listResource}
      emptyWhen={(data) => data.items.length === 0 && !hasActiveFilters()}
      emptyFallback={
        props.emptyFallback ?? (
          <EmptyState
            variant="list"
            title="No files yet"
            description="Upload an image to add it to the library."
          />
        )
      }
    >
      {(data) => {
        props.onListLoaded?.(data);
        return (
          <div class="space-y-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div class="flex-1">
                <label
                  class="mb-1 block text-sm font-medium text-ink"
                  for={props.compact ? "media-picker-search" : "media-search"}
                >
                  Search
                </label>
                <FormTextInput
                  id={props.compact ? "media-picker-search" : "media-search"}
                  name="media-search"
                  type="search"
                  placeholder="Filename…"
                  value={searchInput()}
                  onInput={(e) => setSearchInput(e.currentTarget.value)}
                />
              </div>
              <div class="sm:w-40">
                <label
                  class="mb-1 block text-sm font-medium text-ink"
                  for={props.compact ? "media-picker-mime" : "media-mime"}
                >
                  Type
                </label>
                <select
                  id={props.compact ? "media-picker-mime" : "media-mime"}
                  class="siam-input w-full"
                  value={mimeFilter()}
                  onChange={(e) => onMimeChange(e.currentTarget.value)}
                >
                  <For each={mimeOptions()}>
                    {(opt) => <option value={opt.value}>{opt.label}</option>}
                  </For>
                </select>
              </div>
            </div>

            <Show
              when={data.items.length > 0}
              fallback={
                <EmptyState
                  variant="list"
                  title="No matches"
                  description="Try a different search or filter."
                />
              }
            >
              <MediaLibraryGrid
                items={data.items}
                selectedId={props.selectedId}
                onSelect={props.onSelect}
              />
            </Show>

            <Show when={data.meta.totalPages > 1}>
              <nav
                class="flex items-center justify-between gap-4 border-t border-border pt-4"
                aria-label="Media pagination"
              >
                <p class="text-sm text-ink-muted">
                  Page {data.meta.page} · {data.meta.total} file
                  {data.meta.total === 1 ? "" : "s"}
                </p>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="siam-btn-secondary text-sm"
                    disabled={data.meta.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    class="siam-btn-secondary text-sm"
                    disabled={data.meta.page >= data.meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </nav>
            </Show>
          </div>
        );
      }}
    </ResourceRequest>
  );
}

/** Resolve selected item from the latest loaded page (for picker confirm). */
export function findMediaInList(
  data: MediaListResponse | undefined,
  id: string | null,
): MediaAdmin | undefined {
  if (!data || !id) return undefined;
  return data.items.find((item) => item.id === id);
}
