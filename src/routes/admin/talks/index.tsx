import { A, useSearchParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminTalksApi } from "~/lib/api/endpoints/admin/talks.api";
import type { TalkAdminSummary } from "~/lib/api/types/talks.types";
import { TALK_TYPE_LABELS, TALK_TYPES } from "~/lib/talks/talkLabels";
import { ChevronRight } from "~/icons";

const PUBLISH_STATUSES = [
  "draft",
  "published",
  "scheduled",
  "archived",
] as const;

function formatStarts(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function parsePublishStatusFromSearch(
  params: Record<string, string | undefined>,
): string {
  const raw = params.publishStatus ?? params.status ?? "";
  return PUBLISH_STATUSES.includes(raw as (typeof PUBLISH_STATUSES)[number])
    ? raw
    : "";
}

export default function AdminTalksList() {
  const [searchParams] = useSearchParams();
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal("");
  const [talkType, setTalkType] = createSignal("");

  createEffect(() => {
    setPublishStatus(
      parsePublishStatusFromSearch(
        searchParams as Record<string, string | undefined>,
      ),
    );
  });

  const listResource = createResource(
    () => ({
      q: appliedQ() || undefined,
      publishStatus: publishStatus() || undefined,
      talkType:
        talkType() && TALK_TYPES.includes(talkType() as never)
          ? talkType()
          : undefined,
      page: 1,
      limit: 24,
    }),
    (params) => adminTalksApi.list(params),
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
          title="No talks yet"
          description="Create your first talk draft."
        >
          <A href="/admin/talks/new" class="siam-btn-primary no-underline">
            New talk
          </A>
        </EmptyState>
      }
    >
      {(data) => (
        <div>
          <AdminPageHeader title="Talks" description="Conference and invited talks (P13).">
            <A href="/admin/talks/new" class="siam-btn-primary no-underline">
              New talk
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
                placeholder="Title, slug, or event"
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
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Type</span>
              <select
                class="siam-input"
                value={talkType()}
                onChange={(e) => setTalkType(e.currentTarget.value)}
              >
                <option value="">All</option>
                <For each={TALK_TYPES}>
                  {(t) => (
                    <option value={t}>{TALK_TYPE_LABELS[t]}</option>
                  )}
                </For>
              </select>
            </label>
            <button type="submit" class="siam-btn-secondary">
              Apply
            </button>
          </form>

          <Show when={data.items.length > 0}>
            <div class="mt-6 overflow-x-auto">
              <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr class="border-b border-border text-ink-muted">
                    <th class="py-2 pr-4 font-medium">Title</th>
                    <th class="py-2 pr-4 font-medium">Event</th>
                    <th class="py-2 pr-4 font-medium">Starts</th>
                    <th class="py-2 pr-4 font-medium">Status</th>
                    <th class="py-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  <For each={data.items}>
                    {(row: TalkAdminSummary) => (
                      <tr class="border-b border-border/60 hover:bg-surface-muted/40">
                        <td class="py-3 pr-4 font-medium text-ink">
                          {row.title}
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">{row.eventName}</td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {formatStarts(row.startsAt)}
                        </td>
                        <td class="py-3 pr-4">
                          <PublishStatusBadge status={row.publishStatus} />
                        </td>
                        <td class="py-3">
                          <A
                            href={`/admin/talks/${row.id}/edit`}
                            class="text-primary inline-flex items-center"
                            aria-label={`Edit ${row.title}`}
                          >
                            <ChevronRight class="size-5" />
                          </A>
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
