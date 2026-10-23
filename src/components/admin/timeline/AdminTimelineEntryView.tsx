import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import TimelinePublishControls from "~/components/admin/timeline/TimelinePublishControls";
import type { TimelineAdminDetail } from "~/lib/api/types/timeline.types";
import { formatTimelineDateRange } from "~/lib/timeline/format-timeline-dates";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";

export type AdminTimelineEntryViewProps = {
  entry: TimelineAdminDetail;
  onEntryUpdated?: (entry: TimelineAdminDetail) => void;
};

function formatWhen(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminTimelineEntryView(
  props: AdminTimelineEntryViewProps,
) {
  const e = () => props.entry;

  return (
    <div class="max-w-3xl min-w-0">
      <AdminPageHeader
        title={e().title}
        description={timelineKindLabel(e().kind)}
      >
        <A
          href={`/admin/achievements/${e().id}/edit`}
          class="siam-btn-primary no-underline"
        >
          Edit
        </A>
        <A
          href={`/admin/achievements/${e().id}/preview`}
          class="siam-btn-secondary no-underline"
        >
          Public preview
        </A>
        <TimelinePublishControls
          entryId={e().id}
          publishStatus={e().publishStatus}
          variant="bar"
          onUpdated={props.onEntryUpdated}
        />
        <A href="/admin/achievements" class="siam-btn-secondary no-underline">
          Back to list
        </A>
      </AdminPageHeader>

      <div
        class="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-container-lowest px-4 py-3 text-sm"
      >
        <PublishStatusBadge status={e().publishStatus} />
        <Show when={formatWhen(e().updatedAt)}>
          <span class="text-ink-muted">Updated {formatWhen(e().updatedAt)}</span>
        </Show>
        <span class="text-ink-muted">
          {formatTimelineDateRange(e().startDate, e().endDate, e().isOngoing)}
        </span>
      </div>

      <div class="mt-6">
        <h2 class="text-sm font-medium text-ink-muted">Image gallery</h2>
        <Show
          when={e().mediaLinks.length > 0}
          fallback={
            <p class="mt-2 text-sm text-ink-muted">
              No images yet.{" "}
              <A
                href={`/admin/achievements/${e().id}/edit`}
                class="text-link"
              >
                Edit entry
              </A>{" "}
              to add gallery images.
            </p>
          }
        >
          <ul class="mt-3 grid list-none gap-3 pl-0 sm:grid-cols-2">
            <For
              each={[...e().mediaLinks].sort(
                (a, b) => a.sortOrder - b.sortOrder,
              )}
            >
              {(link) => (
                <li
                  class="overflow-hidden rounded-lg border border-border bg-surface-container-lowest"
                >
                  <Show when={link.url}>
                    <img
                      src={link.url}
                      alt={link.alt?.trim() || ""}
                      class="aspect-video w-full object-cover"
                    />
                  </Show>
                  <div class="p-3 text-sm">
                    <Show when={link.caption}>
                      <p class="text-ink">{link.caption}</p>
                    </Show>
                    <Show when={!link.alt?.trim()}>
                      <p class="text-xs text-warning">Missing alt text</p>
                    </Show>
                  </div>
                </li>
              )}
            </For>
          </ul>
          <p class="mt-2 text-sm text-ink-muted">
            <A href={`/admin/achievements/${e().id}/edit`} class="text-link">
              Edit entry
            </A>{" "}
            to manage the gallery.
          </p>
        </Show>
      </div>

      <div class="mt-6 space-y-4">
        <Show when={e().organization}>
          <div>
            <h2 class="text-sm font-medium text-ink-muted">Organization</h2>
            <p class="mt-1 text-ink">{e().organization}</p>
          </div>
        </Show>
        <Show when={e().summary?.trim()}>
          <div>
            <h2 class="text-sm font-medium text-ink-muted">Summary</h2>
            <p class="mt-1 whitespace-pre-wrap text-ink">{e().summary}</p>
          </div>
        </Show>
        <Show when={e().proofUrl}>
          <div>
            <h2 class="text-sm font-medium text-ink-muted">Proof URL</h2>
            <a
              href={e().proofUrl!}
              class="mt-1 text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {e().proofUrl}
            </a>
          </div>
        </Show>
      </div>
    </div>
  );
}
