import { Show } from "solid-js";
import ArticleMarkdownBody from "~/components/writing/ArticleMarkdownBody";

export type WritingPreviewPaneProps = {
  body: string;
  showPreview: boolean;
};

export default function WritingPreviewPane(props: WritingPreviewPaneProps) {
  return (
    <Show when={props.showPreview}>
      <div class="max-h-[32rem] min-h-[12rem] overflow-auto rounded-md border border-border bg-surface-container-lowest p-4">
        <ArticleMarkdownBody markdown={props.body} />
      </div>
    </Show>
  );
}
