import { A, useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminTimelineApi } from "~/lib/api/endpoints/admin/timeline.api";
import type { TimelineAdminSummary } from "~/lib/api/types/timeline.types";
import {
  ACHIEVEMENT_KINDS,
  EXPERIENCE_KINDS,
} from "~/lib/timeline/timeline-kind-groups";
import { formatTimelineDateRange } from "~/lib/timeline/format-timeline-dates";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";
import { ChevronRight } from "~/icons";

type TabId = "achievements" | "experience";

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminAchievementsList() {
  const navigate = useNavigate();
  const [tab, setTab] = createSignal<TabId>("achievements");
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal("");
  const [sort, setSort] = createSignal<
    "updatedAtDesc" | "startDateDesc" | "titleAsc"
  >("updatedAtDesc");

  const listResource = createResource(
    () => ({
      tab: tab(),
      q: appliedQ() || undefined,
      publishStatus: publishStatus() || undefined,
      sort: sort(),
    }),
    (params) =>
      adminTimelineApi.list({
        kinds:
          params.tab === "achievements"
            ? [...ACHIEVEMENT_KINDS]
            : [...EXPERIENCE_KINDS],
        q: params.q,
        publishStatus: params.publishStatus,
        sort: params.sort,
        page: 1,
        limit: 24,
      }),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    setAppliedQ(q().trim());
  }

  return (
    <div>
      <Title>Achievements & timeline — SIAM Admin</Title>
      <AdminPageHeader
        title="Achievements & timeline"
        description="Recognition and career entries (A07)."
      >
        <A href="/admin/achievements/new" class="siam-btn-primary no-underline">
          New entry
        </A>
      </AdminPageHeader>

      <div class="mt-6 flex gap-2 border-b border-border">
        <button
          type="button"
          class={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab() === "achievements"
              ? "border-primary text-ink"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
          onClick={() => setTab("achievements")}
        >
          Achievements
        </button>
        <button
          type="button"
          class={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            tab() === "experience"
              ? "border-primary text-ink"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
          onClick={() => setTab("experience")}
        >
          Education & experience
        </button>
      </div>

      <form
        class="mt-6 flex flex-wrap items-end gap-3"
        onSubmit={applyFilters}
      >
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Search</span>
          <input
            type="search"
            class="siam-input min-w-[12rem]"
            placeholder="Title or organization"
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
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Sort</span>
          <select
            class="siam-input"
            value={sort()}
            onChange={(e) =>
              setSort(
                e.currentTarget.value as
                  | "updatedAtDesc"
                  | "startDateDesc"
                  | "titleAsc",
              )
            }
          >
            <option value="updatedAtDesc">Recently updated</option>
            <option value="startDateDesc">Start date</option>
            <option value="titleAsc">Title</option>
          </select>
        </label>
        <button type="submit" class="siam-btn-secondary">Apply</button>
      </form>

      <ResourceRequest
        resource={listResource}
        emptyWhen={(data) => data.items.length === 0}
        emptyFallback={
          <EmptyState
            variant="list"
            title={
              tab() === "achievements"
                ? "No achievements yet"
                : "No experience entries yet"
            }
            description="Create a draft entry for this section."
          >
            <A href="/admin/achievements/new" class="siam-btn-primary no-underline">
              New entry
            </A>
          </EmptyState>
        }
      >
        {(data) => (
          <ul class="mt-6 divide-y divide-border rounded-lg border border-border bg-surface-container-lowest">
            <For each={data.items}>
              {(row: TimelineAdminSummary) => (
                <li>
                  <button
                    type="button"
                    class="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-surface-container-low"
                    onClick={() => navigate(`/admin/achievements/${row.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/admin/achievements/${row.id}`);
                      }
                    }}
                  >
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-ink truncate">{row.title}</p>
                      <p class="text-sm text-ink-muted truncate">
                        {timelineKindLabel(row.kind)}
                        {row.organization ? ` · ${row.organization}` : ""}
                      </p>
                      <p class="text-xs text-ink-muted mt-0.5">
                        {formatTimelineDateRange(
                          row.startDate,
                          row.endDate,
                          row.isOngoing,
                        )}{" "}
                        · Updated {formatUpdated(row.updatedAt)}
                      </p>
                    </div>
                    <PublishStatusBadge status={row.publishStatus} />
                    <ChevronRight class="size-5 shrink-0 text-ink-muted" />
                  </button>
                </li>
              )}
            </For>
          </ul>
        )}
      </ResourceRequest>
    </div>
  );
}
