import { A } from "@solidjs/router";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminCollaborationsApi } from "~/lib/api/endpoints/admin/collaborations.api";
import type { CollaborationAdmin } from "~/lib/api/types/talks.types";
import { ChevronRight } from "~/icons";

export default function AdminCollaborationsList() {
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal("");

  const listResource = createResource(
    () => ({
      q: appliedQ() || undefined,
      publishStatus: publishStatus() || undefined,
      page: 1,
      limit: 24,
    }),
    (params) => adminCollaborationsApi.list(params),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    setAppliedQ(q().trim());
  }

  return (
    <ResourceRequest
      resource={listResource}
      emptyWhen={(data) => data.items.length === 0}
      emptyFallback={
        <EmptyState
          variant="list"
          title="No collaborations yet"
          description="Partnership rows default to draft until published."
        >
          <A
            href="/admin/talks/collaborations/new"
            class="siam-btn-primary no-underline"
          >
            New collaboration
          </A>
        </EmptyState>
      }
    >
      {(data) => (
        <div>
          <AdminPageHeader
            title="Collaborations"
            description="Research partnerships (P14)."
          >
            <A
              href="/admin/talks/collaborations/new"
              class="siam-btn-primary no-underline"
            >
              New collaboration
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
                value={q()}
                onInput={(e) => setQ(e.currentTarget.value)}
              />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Status</span>
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
            <button type="submit" class="siam-btn-secondary">
              Apply
            </button>
          </form>

          <Show when={data.items.length > 0}>
            <table class="mt-6 w-full min-w-[28rem] border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-border text-ink-muted">
                  <th class="py-2 pr-4 font-medium">Partner</th>
                  <th class="py-2 pr-4 font-medium">Institution</th>
                  <th class="py-2 pr-4 font-medium">Status</th>
                  <th class="w-8" />
                </tr>
              </thead>
              <tbody>
                <For each={data.items}>
                  {(row: CollaborationAdmin) => (
                    <tr class="border-b border-border/60">
                      <td class="py-3 pr-4 font-medium">{row.partnerName}</td>
                      <td class="py-3 pr-4 text-ink-muted">
                        {row.institution ?? "—"}
                      </td>
                      <td class="py-3 pr-4">
                        <PublishStatusBadge status={row.publishStatus} />
                      </td>
                      <td class="py-3">
                        <A href={`/admin/talks/collaborations/${row.id}/edit`}>
                          <ChevronRight class="size-5 text-primary" />
                        </A>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </Show>
        </div>
      )}
    </ResourceRequest>
  );
}
