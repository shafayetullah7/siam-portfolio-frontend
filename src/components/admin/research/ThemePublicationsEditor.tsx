import { For, Show, createSignal } from "solid-js";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import type { PublicationAdminSummary } from "~/lib/api/endpoints/admin/publications.api";
import type { ResearchThemePublicationLink } from "~/lib/api/types/research.types";
import { getApiErrorMessage } from "~/lib/api/errors";

export type ThemePublicationsEditorProps = {
  links: ResearchThemePublicationLink[];
  onChange: (links: ResearchThemePublicationLink[]) => void;
  onDirty: () => void;
};

export default function ThemePublicationsEditor(
  props: ThemePublicationsEditorProps,
) {
  const [pickerOpen, setPickerOpen] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [searchResults, setSearchResults] = createSignal<
    PublicationAdminSummary[]
  >([]);
  const [searchPending, setSearchPending] = createSignal(false);
  const [searchError, setSearchError] = createSignal<string | null>(null);

  const linkedIds = () => new Set(props.links.map((l) => l.id));

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= props.links.length) return;
    const rows = [...props.links];
    const [removed] = rows.splice(index, 1);
    rows.splice(next, 0, removed);
    props.onChange(
      rows.map((row, i) => ({ ...row, sortOrder: i })),
    );
    props.onDirty();
  }

  function remove(index: number) {
    const rows = props.links.filter((_, i) => i !== index);
    props.onChange(rows.map((row, i) => ({ ...row, sortOrder: i })));
    props.onDirty();
  }

  function addFromSearch(pub: PublicationAdminSummary) {
    if (linkedIds().has(pub.id) || props.links.length >= 20) return;
    props.onChange([
      ...props.links,
      {
        id: pub.id,
        slug: pub.slug,
        title: pub.title,
        authorsShort: pub.authorsShort,
        year: pub.year,
        venue: pub.venue,
        publishStatus: pub.publishStatus,
        sortOrder: props.links.length,
      },
    ]);
    props.onDirty();
    setPickerOpen(false);
  }

  async function runSearch() {
    setSearchPending(true);
    setSearchError(null);
    try {
      const q = searchQuery().trim();
      const rows = await adminPublicationsApi.list(
        q ? { q, limit: 25 } : { limit: 25 },
      );
      setSearchResults(rows);
    } catch (error) {
      setSearchError(getApiErrorMessage(error));
      setSearchResults([]);
    } finally {
      setSearchPending(false);
    }
  }

  return (
    <div class="space-y-3">
      <For each={props.links}>
        {(link, index) => (
          <div
            class="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-ink">{link.title}</span>
                <PublishStatusBadge status={link.publishStatus} />
              </div>
              <p class="text-sm text-ink-muted">
                {link.authorsShort} · {link.venue} ({link.year})
              </p>
            </div>
            <div class="flex shrink-0 gap-1">
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-sm"
                disabled={index() === 0}
                onClick={() => move(index(), -1)}
              >
                Up
              </button>
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-sm"
                disabled={index() === props.links.length - 1}
                onClick={() => move(index(), 1)}
              >
                Down
              </button>
              <button
                type="button"
                class="siam-btn-secondary px-2 py-1 text-sm"
                onClick={() => remove(index())}
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </For>

      <button
        type="button"
        class="siam-btn-secondary"
        disabled={props.links.length >= 20}
        onClick={() => {
          setPickerOpen(true);
          void runSearch();
        }}
      >
        Add publication
      </button>

      <Show when={pickerOpen()}>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search publications"
        >
          <div class="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl bg-surface-container-lowest p-4 shadow-lg">
            <div class="mb-3 flex items-center justify-between gap-2">
              <h3 class="text-lg font-semibold text-ink">Search publications</h3>
              <button
                type="button"
                class="siam-btn-secondary"
                onClick={() => setPickerOpen(false)}
              >
                Close
              </button>
            </div>
            <div class="mb-3 flex gap-2">
              <input
                type="search"
                class="siam-input flex-1"
                placeholder="Title or slug"
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void runSearch();
                  }
                }}
              />
              <button
                type="button"
                class="siam-btn-primary"
                disabled={searchPending()}
                onClick={() => void runSearch()}
              >
                Search
              </button>
            </div>
            <Show when={searchError()}>
              <p class="mb-2 text-sm text-destructive">{searchError()}</p>
            </Show>
            <ul class="list-none space-y-2 p-0">
              <For each={searchResults()}>
                {(pub) => (
                  <li>
                    <button
                      type="button"
                      class="w-full rounded-lg border border-border p-3 text-left hover:bg-surface-container disabled:opacity-50"
                      disabled={linkedIds().has(pub.id)}
                      onClick={() => addFromSearch(pub)}
                    >
                      <div class="font-medium">{pub.title}</div>
                      <div class="text-sm text-ink-muted">
                        {pub.slug} · {pub.publishStatus}
                      </div>
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
      </Show>
    </div>
  );
}
