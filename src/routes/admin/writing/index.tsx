import { A, useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import WritingPublishControls from "~/components/admin/writing/WritingPublishControls";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminWritingApi } from "~/lib/api/endpoints/admin/writing.api";
import type { WritingAdminSummary } from "~/lib/api/types/writing.types";
import { ChevronRight } from "~/icons";

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminWritingList() {
  const navigate = useNavigate();
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal("");

  const writingResource = createResource(
    () => ({
      q: appliedQ() || undefined,
      publishStatus: publishStatus() || undefined,
      page: 1,
      limit: 24,
    }),
    (params) => adminWritingApi.list(params),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    setAppliedQ(q().trim());
  }

  return (
    <ResourceRequest
      resource={writingResource}
      emptyWhen={(data) => data.items.length === 0}
      emptyFallback={
        <EmptyState
          variant="list"
          title="No articles yet"
          description="Create your first article draft to manage writing from the admin."
        >
          <A href="/admin/writing/new" class="siam-btn-primary no-underline">
            New article
          </A>
        </EmptyState>
      }
    >
      {(data) => (
        <div>
          <Title>Writing — SIAM Admin</Title>
          <AdminPageHeader
            title="Writing"
            description="Draft and published articles (A08)."
          >
            <A href="/admin/writing/new" class="siam-btn-primary no-underline">
              New article
            </A>
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
                placeholder="Title or slug"
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

          <Show when={data.items.length > 0}>
            <div class="mt-6 overflow-x-auto">
              <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr class="border-b border-border text-ink-muted">
                    <th class="py-2 pr-4 font-medium">Title</th>
                    <th class="py-2 pr-4 font-medium">Status</th>
                    <th class="py-2 pr-4 font-medium">Updated</th>
                    <th class="py-2 pr-4 font-medium">Read time</th>
                    <th class="py-2 pr-4 font-medium">Tags</th>
                    <th class="py-2 pr-4 font-medium">Publish</th>
                    <th class="w-10 py-2 font-medium" aria-label="Open" />
                  </tr>
                </thead>
                <tbody>
                  <For each={data.items}>
                    {(article: WritingAdminSummary) => (
                      <tr
                        class="cursor-pointer border-b border-border transition-colors hover:bg-surface-container-lowest"
                        tabIndex={0}
                        role="link"
                        aria-label={`View ${article.title}`}
                        onClick={() => navigate(`/admin/writing/${article.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/admin/writing/${article.id}`);
                          }
                        }}
                      >
                        <td class="py-3 pr-4 font-medium text-ink">
                          {article.title}
                        </td>
                        <td class="py-3 pr-4">
                          <PublishStatusBadge status={article.publishStatus} />
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {formatUpdated(article.updatedAt)}
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {article.readingTimeMinutes != null
                            ? `${article.readingTimeMinutes} min`
                            : "—"}
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {article.tags?.length
                            ? article.tags.join(", ")
                            : "—"}
                        </td>
                        <td class="py-3 pr-4">
                          <WritingPublishControls
                            articleId={article.id}
                            publishStatus={article.publishStatus}
                            variant="compact"
                            onUpdated={() => void writingResource[1].refetch()}
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
