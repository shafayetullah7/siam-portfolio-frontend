import { Title } from "@solidjs/meta";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import MediaLibraryGrid from "~/components/admin/media/MediaLibraryGrid";
import MediaMetadataPanel from "~/components/admin/media/MediaMetadataPanel";
import MediaUploadZone from "~/components/admin/media/MediaUploadZone";
import EmptyState from "~/components/EmptyState";
import FormTextInput from "~/components/forms/FormTextInput";
import ResourceRequest from "~/components/ResourceRequest";
import { adminMediaApi } from "~/lib/api/endpoints/admin/media.api";
import type { MediaAdmin } from "~/lib/api/types/admin.types";

const PAGE_LIMIT = 24;

const MIME_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All types" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/gif", label: "GIF" },
  { value: "application/pdf", label: "PDF" },
];

export default function AdminMediaLibrary() {
  const [searchInput, setSearchInput] = createSignal("");
  const [debouncedQ, setDebouncedQ] = createSignal("");
  const [mimeFilter, setMimeFilter] = createSignal("");
  const [page, setPage] = createSignal(1);
  const [selectedId, setSelectedId] = createSignal<string | null>(null);

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
      page: page(),
      limit: PAGE_LIMIT,
    }),
    (params) => adminMediaApi.list(params),
  );

  const hasActiveFilters = () => Boolean(debouncedQ() || mimeFilter());

  function onUploaded(item: MediaAdmin) {
    listResource[1].refetch();
    setSelectedId(item.id);
  }

  function onMimeChange(value: string) {
    setMimeFilter(value);
    setPage(1);
  }

  return (
    <ResourceRequest
      resource={listResource}
      emptyWhen={(data) => data.items.length === 0 && !hasActiveFilters()}
      emptyFallback={
        <div>
          <Title>Media library — SIAM Admin</Title>
          <AdminPageHeader
            title="Media library"
            description="Upload and manage images and PDFs for your site."
          />
          <EmptyState
            variant="list"
            title="No files yet"
            description="Upload an image or PDF to build your library."
          >
            <div class="max-w-md">
              <MediaUploadZone onUploaded={onUploaded} />
            </div>
          </EmptyState>
        </div>
      }
    >
      {(data) => (
        <div>
          <Title>Media library — SIAM Admin</Title>
          <AdminPageHeader
            title="Media library"
            description="Upload and manage images and PDFs for your site."
          />

          <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(280px,320px)]">
            <div class="min-w-0 space-y-4">
              <MediaUploadZone onUploaded={onUploaded} />

              <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div class="flex-1">
                  <label class="mb-1 block text-sm font-medium text-ink" for="media-search">
                    Search
                  </label>
                  <FormTextInput
                    id="media-search"
                    name="media-search"
                    type="search"
                    placeholder="Filename…"
                    value={searchInput()}
                    onInput={(e) => setSearchInput(e.currentTarget.value)}
                  />
                </div>
                <div class="sm:w-40">
                  <label class="mb-1 block text-sm font-medium text-ink" for="media-mime">
                    Type
                  </label>
                  <select
                    id="media-mime"
                    class="siam-input w-full"
                    value={mimeFilter()}
                    onChange={(e) => onMimeChange(e.currentTarget.value)}
                  >
                    <For each={MIME_FILTER_OPTIONS}>
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
                  selectedId={selectedId()}
                  onSelect={setSelectedId}
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

            <MediaMetadataPanel
              mediaId={selectedId()}
              onUpdated={() => listResource[1].refetch()}
              onDeleted={() => {
                setSelectedId(null);
                listResource[1].refetch();
              }}
              onClose={() => setSelectedId(null)}
            />
          </div>
        </div>
      )}
    </ResourceRequest>
  );
}
