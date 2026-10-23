import { For, Show } from "solid-js";
import type { TimelineEntryKind } from "~/lib/api/types/timeline.types";
import type { TimelineEntryWriteInput } from "~/lib/forms/schemas/timeline-entry-write.schema";
import {
  dateFromMonthInput,
  monthInputFromDate,
} from "~/lib/timeline/format-timeline-dates";
import { clearIncompatibleTimelineFields } from "~/lib/timeline/timeline-kind-fields";
import { fieldFlagsForKind } from "~/lib/timeline/timeline-kind-fields";
import { ALL_TIMELINE_KINDS } from "~/lib/timeline/timeline-kind-groups";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";
import TimelineRelatedWorkFields from "./TimelineRelatedWorkFields";

export type TimelineEntryFormProps = {
  draft: TimelineEntryWriteInput;
  fieldErrors: Record<string, string>;
  onChange: (next: TimelineEntryWriteInput) => void;
  allowKindChange?: boolean;
};

function fieldError(errors: Record<string, string>, key: string): string | undefined {
  return errors[key];
}

export default function TimelineEntryForm(props: TimelineEntryFormProps) {
  const flags = () => fieldFlagsForKind(props.draft.kind);

  function patch(patch: Partial<TimelineEntryWriteInput>) {
    props.onChange({ ...props.draft, ...patch });
  }

  function onKindChange(kind: TimelineEntryKind) {
    const cleared = clearIncompatibleTimelineFields(
      props.draft as Record<string, unknown>,
      kind,
    ) as TimelineEntryWriteInput;
    props.onChange(cleared);
  }

  return (
    <div class="space-y-6">
      <Show when={props.allowKindChange}>
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Entry kind</span>
          <select
            class="siam-input max-w-md"
            value={props.draft.kind}
            onChange={(e) =>
              onKindChange(e.currentTarget.value as TimelineEntryKind)
            }
          >
            <For each={[...ALL_TIMELINE_KINDS]}>
              {(kind) => (
                <option value={kind}>{timelineKindLabel(kind)}</option>
              )}
            </For>
          </select>
        </label>
      </Show>

      <label class="flex flex-col gap-1 text-sm">
        <span class="text-ink-muted">Title</span>
        <input
          type="text"
          class="siam-input"
          name="title"
          value={props.draft.title}
          onInput={(e) => patch({ title: e.currentTarget.value })}
        />
        <Show when={fieldError(props.fieldErrors, "title")}>
          <span class="text-sm text-error">{fieldError(props.fieldErrors, "title")}</span>
        </Show>
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="text-ink-muted">Subtitle (optional)</span>
        <input
          type="text"
          class="siam-input"
          value={props.draft.subtitle ?? ""}
          onInput={(e) => patch({ subtitle: e.currentTarget.value || null })}
        />
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="text-ink-muted">Summary (optional)</span>
        <textarea
          class="siam-input min-h-[6rem]"
          value={props.draft.summary ?? ""}
          onInput={(e) => patch({ summary: e.currentTarget.value || null })}
        />
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="text-ink-muted">Organization / institution (optional)</span>
        <input
          type="text"
          class="siam-input"
          value={props.draft.organization ?? ""}
          onInput={(e) => patch({ organization: e.currentTarget.value || null })}
        />
      </label>

      <label class="flex flex-col gap-1 text-sm">
        <span class="text-ink-muted">Location (optional)</span>
        <input
          type="text"
          class="siam-input"
          value={props.draft.location ?? ""}
          onInput={(e) => patch({ location: e.currentTarget.value || null })}
        />
      </label>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Start (month)</span>
          <input
            type="month"
            class="siam-input"
            value={monthInputFromDate(props.draft.startDate)}
            onInput={(e) =>
              patch({ startDate: dateFromMonthInput(e.currentTarget.value) })
            }
          />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">End (month)</span>
          <input
            type="month"
            class="siam-input"
            disabled={props.draft.isOngoing}
            value={monthInputFromDate(props.draft.endDate)}
            onInput={(e) =>
              patch({ endDate: dateFromMonthInput(e.currentTarget.value) })
            }
          />
        </label>
      </div>

      <label class="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.draft.isOngoing ?? false}
          onChange={(e) =>
            patch({
              isOngoing: e.currentTarget.checked,
              endDate: e.currentTarget.checked ? null : props.draft.endDate,
            })
          }
        />
        <span>Ongoing (no end date)</span>
      </label>
      <Show when={fieldError(props.fieldErrors, "endDate")}>
        <span class="text-sm text-error">{fieldError(props.fieldErrors, "endDate")}</span>
      </Show>

      <Show when={flags().showIsCurrent}>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={props.draft.isCurrent ?? false}
            onChange={(e) => patch({ isCurrent: e.currentTarget.checked })}
          />
          <span>Highlight as current role or program on About</span>
        </label>
      </Show>

      <Show when={flags().showProofUrl}>
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Proof URL (optional)</span>
          <input
            type="url"
            class="siam-input"
            value={props.draft.proofUrl ?? ""}
            onInput={(e) => patch({ proofUrl: e.currentTarget.value || null })}
          />
          <Show when={flags().proofUrlHint}>
            <span class="text-xs text-ink-muted">{flags().proofUrlHint}</span>
          </Show>
        </label>
      </Show>

      <Show when={flags().showRankOrPlacement}>
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Rank or placement (optional)</span>
          <input
            type="text"
            class="siam-input"
            value={props.draft.rankOrPlacement ?? ""}
            onInput={(e) =>
              patch({ rankOrPlacement: e.currentTarget.value || null })
            }
          />
        </label>
      </Show>

      <Show when={flags().showEventName}>
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Event name (optional)</span>
          <input
            type="text"
            class="siam-input"
            value={props.draft.eventName ?? ""}
            onInput={(e) => patch({ eventName: e.currentTarget.value || null })}
          />
        </label>
      </Show>

      <Show when={flags().showCredentialId}>
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Credential ID (optional)</span>
          <input
            type="text"
            class="siam-input"
            value={props.draft.credentialId ?? ""}
            onInput={(e) =>
              patch({ credentialId: e.currentTarget.value || null })
            }
          />
        </label>
      </Show>

      <Show when={flags().showExpiresAt}>
        <label class="flex flex-col gap-1 text-sm max-w-xs">
          <span class="text-ink-muted">Expires (month, optional)</span>
          <input
            type="month"
            class="siam-input"
            value={monthInputFromDate(props.draft.expiresAt)}
            onInput={(e) =>
              patch({ expiresAt: dateFromMonthInput(e.currentTarget.value) })
            }
          />
        </label>
      </Show>

      <TimelineRelatedWorkFields draft={props.draft} onChange={patch} />

      <label class="flex flex-col gap-1 text-sm">
        <span class="text-ink-muted">Public slug (optional)</span>
        <input
          type="text"
          class="siam-input max-w-md"
          placeholder="my-award"
          value={props.draft.slug ?? ""}
          onInput={(e) => patch({ slug: e.currentTarget.value || null })}
        />
        <span class="text-xs text-ink-muted">
          Lowercase letters, numbers, and hyphens. Leave empty for list-only entries.
        </span>
        <Show when={fieldError(props.fieldErrors, "slug")}>
          <span class="text-sm text-error">{fieldError(props.fieldErrors, "slug")}</span>
        </Show>
      </label>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex flex-col gap-1 text-sm">
          <span class="text-ink-muted">Sort order</span>
          <input
            type="number"
            min={0}
            class="siam-input max-w-[8rem]"
            value={props.draft.sortOrder ?? 0}
            onInput={(e) =>
              patch({ sortOrder: Number(e.currentTarget.value) || 0 })
            }
          />
        </label>
        <label class="flex items-center gap-2 text-sm pt-6">
          <input
            type="checkbox"
            checked={props.draft.featured ?? false}
            onChange={(e) => patch({ featured: e.currentTarget.checked })}
          />
          <span>Featured on achievements overview</span>
        </label>
      </div>

      <label class="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={props.draft.hideFromSearch ?? false}
          onChange={(e) => patch({ hideFromSearch: e.currentTarget.checked })}
        />
        <span>Hide from site search (when enabled)</span>
      </label>
    </div>
  );
}
