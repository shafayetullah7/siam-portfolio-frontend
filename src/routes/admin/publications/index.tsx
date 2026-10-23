import { A, useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import PublicationPublishControls from "~/components/admin/publications/PublicationPublishControls";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import type { PublicationAdminSummary } from "~/lib/api/endpoints/admin/publications.api";
import { ChevronRight } from "~/icons";

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminPublicationsList() {
  const navigate = useNavigate();
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal("");

  const publicationsResource = createResource(
    () => ({
      q: appliedQ() || undefined,
      publishStatus: publishStatus() || undefined,
      limit: 100,
    }),
    (params) => adminPublicationsApi.list(params),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    setAppliedQ(q().trim());
  }

  return (
    <ResourceRequest
      resource={publicationsResource}
      emptyWhen={(items) => items.length === 0}
      emptyFallback={
        <EmptyState
          variant="list"
          title="No publications yet"
          description="Create your first publication draft to manage scholarly works from the admin."
        >
          <A href="/admin/publications/new" class="siam-btn-primary no-underline">
            New publication
          </A>
        </EmptyState>
      }
    >
      {(items) => (
        <div>
          <Title>Publications — SIAM Admin</Title>
          <AdminPageHeader
            title="Publications"
            description="Draft and published scholarly works (A05)."
          >
            <div class="flex flex-wrap gap-2">
              <A
                href="/admin/publications/import"
                class="siam-btn-secondary no-underline"
              >
                Import
              </A>
              <A
                href="/admin/publications/new"
                class="siam-btn-primary no-underline"
              >
                New publication
              </A>
            </div>
          </AdminPageHeader>

          <form
            class="mt-6 flex flex-wrap items-end gap-3"
            onSubmit={applyFilters}
          >
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Search</span>
              <input
                type="search"
                class="siam-input min-w-[12rem]"
                placeholder="Title, slug, authors, DOI"
                value={q()}
                onInput={(e) => setQ(e.currentTarget.value)}
              />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Publish status</span>
              <select
                class="siam-input"
                value={publishStatus()}
                onChange={(e) => setPublishStatus(e.currentTarget.value)}
              >
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <button type="submit" class="siam-btn-secondary">Apply</button>
          </form>

          <Show when={items.length > 0}>
            <div class="mt-6 overflow-x-auto">
              <table class="w-full min-w-[40rem] border-collapse text-left text-sm">
                <thead>
                  <tr class="border-b border-border text-ink-muted">
                    <th class="py-2 pr-4 font-medium">Title</th>
                    <th class="py-2 pr-4 font-medium">Year</th>
                    <th class="py-2 pr-4 font-medium">Venue</th>
                    <th class="py-2 pr-4 font-medium">Status</th>
                    <th class="py-2 pr-4 font-medium">Updated</th>
                    <th class="py-2 pr-4 font-medium">Actions</th>
                    <th class="w-10 py-2 font-medium" aria-label="Open" />
                  </tr>
                </thead>
                <tbody>
                  <For each={items}>
                    {(pub: PublicationAdminSummary) => (
                      <tr
                        class="border-b border-border cursor-pointer transition-colors hover:bg-surface-container-lowest"
                        tabIndex={0}
                        role="link"
                        aria-label={`View ${pub.title}`}
                        onClick={() =>
                          navigate(`/admin/publications/${pub.id}`)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/admin/publications/${pub.id}`);
                          }
                        }}
                      >
                        <td class="py-3 pr-4 font-medium text-ink">
                          <span>{pub.title}</span>
                          <Show when={pub.duplicateHint}>
                            <span
                              class="ml-2 inline-flex rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-200"
                              title="Another record shares this DOI or title and year"
                            >
                              Duplicate hint
                            </span>
                          </Show>
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">{pub.year}</td>
                        <td class="py-3 pr-4 text-ink-muted">{pub.venue}</td>
                        <td class="py-3 pr-4">
                          <PublishStatusBadge status={pub.publishStatus} />
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {formatUpdated(pub.updatedAt)}
                        </td>
                        <td class="py-3 pr-4">
                          <PublicationPublishControls
                            publicationId={pub.id}
                            publishStatus={pub.publishStatus}
                            variant="compact"
                            onUpdated={() => void publicationsResource[1].refetch()}
                          />
                        </td>
                        <td class="py-3 text-ink-muted">
                          <ChevronRight class="size-4" aria-hidden="true" />
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </div>
      )}
    </ResourceRequest>
  );
}
