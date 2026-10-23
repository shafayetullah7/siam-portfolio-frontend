import FormField from "~/components/forms/FormField";
import type { WritingWriteInput } from "~/lib/forms/schemas/writing-write.schema";
import { countWords, readingTimeMinutes } from "./writingStats";

export type WritingBodyEditorProps = {
  draft: WritingWriteInput;
  onChange: (patch: Partial<WritingWriteInput>) => void;
  error?: string;
};

export default function WritingBodyEditor(props: WritingBodyEditorProps) {
  const wordCount = () => countWords(props.draft.body ?? "");
  const minutes = () => readingTimeMinutes(wordCount());

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
        />
      </FormField>
    </div>
  );
}
