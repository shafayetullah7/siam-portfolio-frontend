import { For } from "solid-js";
import type { TimelineEntryKind } from "~/lib/api/types/timeline.types";
import {
  ACHIEVEMENT_KINDS,
  EXPERIENCE_KINDS,
} from "~/lib/timeline/timeline-kind-groups";
import { timelineKindLabel } from "~/lib/timeline/timeline-kind-labels";

export type TimelineKindPickerProps = {
  selected?: TimelineEntryKind | null;
  onSelect: (kind: TimelineEntryKind) => void;
};

function KindGroup(props: {
  title: string;
  kinds: readonly TimelineEntryKind[];
  selected?: TimelineEntryKind | null;
  onSelect: (kind: TimelineEntryKind) => void;
}) {
  return (
    <div>
      <h2 class="text-sm font-medium text-ink-muted">{props.title}</h2>
      <ul class="mt-2 grid gap-2 sm:grid-cols-2">
        <For each={[...props.kinds]}>
          {(kind) => (
            <li>
              <button
                type="button"
                class={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  props.selected === kind
                    ? "border-primary bg-primary/10 text-ink"
                    : "border-border bg-surface-container-lowest text-ink hover:border-primary/40"
                }`}
                onClick={() => props.onSelect(kind)}
              >
                {timelineKindLabel(kind)}
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

export default function TimelineKindPicker(props: TimelineKindPickerProps) {
  return (
    <div class="space-y-6">
      <KindGroup
        title="Achievements & recognition (P09)"
        kinds={ACHIEVEMENT_KINDS}
        selected={props.selected}
        onSelect={props.onSelect}
      />
      <KindGroup
        title="Education & experience (P10)"
        kinds={EXPERIENCE_KINDS}
        selected={props.selected}
        onSelect={props.onSelect}
      />
    </div>
  );
}
