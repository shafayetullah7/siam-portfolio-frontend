import { For, Show } from "solid-js";
import AdminDialog from "~/components/admin/AdminDialog";
import type { RevisionSnapshotField } from "~/lib/research/researchRevisionDiff";

function formatRevisionDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export type ResearchRevisionChangesDialogProps = {
  open: boolean;
  revisionTime: string | null;
  changes: RevisionSnapshotField[];
  onClose: () => void;
};

export default function ResearchRevisionChangesDialog(
  props: ResearchRevisionChangesDialogProps,
) {
  const title = () =>
    props.revisionTime
      ? `Changes at ${formatRevisionDateTime(props.revisionTime)}`
      : "Changes";

  return (
    <AdminDialog open={props.open} title={title()} iconClose onClose={props.onClose}>
      <Show
        when={props.changes.length > 0}
        fallback={
          <p class="text-sm text-ink-muted">
            No field changes were recorded for this save.
          </p>
        }
      >
        <div class="overflow-x-auto">
          <table class="w-full min-w-[280px] table-fixed border-collapse text-left text-sm">
            <colgroup>
              <col class="w-[32%]" />
              <col class="w-[68%]" />
            </colgroup>
            <thead>
              <tr class="border-b border-border text-ink-muted">
                <th class="py-2 pr-3 font-medium" scope="col">Field</th>
                <th class="py-2 font-medium" scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <For each={props.changes}>
                {(row) => (
                  <tr class="border-b border-border/60 align-top">
                    <td class="py-2 pr-3 font-medium text-ink">{row.label}</td>
                    <td class="py-2 text-ink">
                      <div
                        class="line-clamp-6 break-words"
                        title={row.valueText}
                      >
                        {row.valueText}
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </AdminDialog>
  );
}
