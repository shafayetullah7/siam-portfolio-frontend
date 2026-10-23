import { Show } from "solid-js";

export type WritingPreviewPaneProps = {
  body: string;
  showPreview: boolean;
};

export default function WritingPreviewPane(props: WritingPreviewPaneProps) {
  return (
    <Show
      when={props.showPreview}
      fallback={
        <p class="text-sm text-ink-muted">
          Preview shows raw Markdown until rich rendering ships (WRIT9).
        </p>
      }
    >
      <pre
        class="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-surface-container-lowest p-4 font-mono text-sm text-ink"
      >
        {props.body || "(empty)"}
      </pre>
    </Show>
  );
}
