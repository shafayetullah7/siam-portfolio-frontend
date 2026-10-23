import FormField from "~/components/forms/FormField";
import type { WritingWriteInput } from "~/lib/forms/schemas/writing-write.schema";
import {
  pastedHtmlNeedsSanitization,
  plainTextFromClipboard,
} from "~/lib/markdown/sanitizePastedHtml";
import { countWords, readingTimeMinutes } from "./writingStats";

export type WritingBodyEditorProps = {
  draft: WritingWriteInput;
  onChange: (patch: Partial<WritingWriteInput>) => void;
  error?: string;
  onPasteSanitized?: () => void;
};

function insertTextAtCaret(
  textarea: HTMLTextAreaElement,
  text: string,
): string {
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? 0;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const next = `${before}${text}${after}`;
  const caret = start + text.length;
  textarea.value = next;
  textarea.selectionStart = caret;
  textarea.selectionEnd = caret;
  return next;
}

export default function WritingBodyEditor(props: WritingBodyEditorProps) {
  const wordCount = () => countWords(props.draft.body ?? "");
  const minutes = () => readingTimeMinutes(wordCount());

  function handlePaste(e: ClipboardEvent) {
    const textarea = e.currentTarget as HTMLTextAreaElement;
    const html = e.clipboardData?.getData("text/html") ?? "";
    const plain = e.clipboardData?.getData("text/plain") ?? "";

    if (!pastedHtmlNeedsSanitization(html)) {
      return;
    }

    e.preventDefault();
    const text = plainTextFromClipboard(html, plain);
    const nextBody = insertTextAtCaret(textarea, text);
    props.onChange({ body: nextBody });
    props.onPasteSanitized?.();
  }

  return (
    <div class="flex min-h-0 flex-col gap-2">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 class="text-sm font-medium text-ink">Body (Markdown)</h2>
        <p class="text-xs text-ink-muted">
          {wordCount()} words · ~{minutes()} min read
        </p>
      </div>
      <FormField label="Article body" name="body" error={props.error}>
        <textarea
          name="body"
          class="siam-input min-h-[16rem] w-full font-mono text-sm lg:min-h-[24rem]"
          value={props.draft.body ?? ""}
          onInput={(e) => props.onChange({ body: e.currentTarget.value })}
          onPaste={handlePaste}
        />
      </FormField>
    </div>
  );
}
