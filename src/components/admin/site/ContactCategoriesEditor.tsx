import { For, Show } from "solid-js";
import FormTextInput from "~/components/forms/FormTextInput";

export type ContactCategoriesEditorProps = {
  categories: string[];
  onChange: (categories: string[]) => void;
  onDirty: () => void;
  maxCategories?: number;
};

const DEFAULT_MAX = 20;

export default function ContactCategoriesEditor(props: ContactCategoriesEditorProps) {
  const max = () => props.maxCategories ?? DEFAULT_MAX;

  function updateCategory(index: number, value: string) {
    props.onDirty();
    props.onChange(
      props.categories.map((row, i) => (i === index ? value : row)),
    );
  }

  function remove(index: number) {
    props.onDirty();
    props.onChange(props.categories.filter((_, i) => i !== index));
  }

  function addCategory() {
    if (props.categories.length >= max()) return;
    props.onDirty();
    props.onChange([...props.categories, ""]);
  }

  return (
    <div class="space-y-3">
      <For each={props.categories}>
        {(category, index) => (
          <div class="flex flex-wrap items-end gap-2">
            <div class="min-w-[12rem] flex-1">
              <FormTextInput
                name="contactCategory"
                value={category}
                placeholder="e.g. Collaboration"
                onInput={(e) => updateCategory(index(), e.currentTarget.value)}
              />
            </div>
            <button
              type="button"
              class="siam-btn-secondary px-3 py-2 text-sm"
              onClick={() => remove(index())}
            >
              Remove
            </button>
          </div>
        )}
      </For>
      <Show when={props.categories.length < max()}>
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          onClick={addCategory}
        >
          Add category
        </button>
      </Show>
      <p class="text-xs text-ink-muted">
        Up to {max()} options for the public contact form dropdown. Empty rows are
        ignored on save.
      </p>
    </div>
  );
}
