import { Show } from "solid-js";
import type { AutosaveState } from "~/lib/forms/useDebouncedWritingAutosave";

export type AutosaveStatusProps = {
  state: AutosaveState;
};

function formatSaved(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleTimeString();
}

export default function AutosaveStatus(props: AutosaveStatusProps) {
  return (
    <p class="text-sm text-ink-muted" aria-live="polite">
      <Show when={props.state.status === "saving"}>Saving…</Show>
      <Show when={props.state.status === "saved"}>
        Saved at {formatSaved(props.state.savedAt)}
      </Show>
      <Show when={props.state.status === "error"}>
        Couldn&apos;t save: {props.state.message}
      </Show>
    </p>
  );
}
