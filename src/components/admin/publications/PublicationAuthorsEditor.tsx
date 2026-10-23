import { For, Show } from "solid-js";
import FormTextInput from "~/components/forms/FormTextInput";
import { formatAuthorsShortPreview } from "~/lib/publications/format-authors-short";

export type PublicationAuthorDraft = {
  name: string;
  affiliation?: string | null;
  orcid?: string | null;
};

export type PublicationAuthorsEditorProps = {
  authors: PublicationAuthorDraft[];
  onChange: (authors: PublicationAuthorDraft[]) => void;
  onDirty: () => void;
  nameError?: string;
};

export default function PublicationAuthorsEditor(
  props: PublicationAuthorsEditorProps,
) {
  const preview = () => formatAuthorsShortPreview(props.authors);

  function updateAuthor(
    index: number,
    patch: Partial<PublicationAuthorDraft>,
  ) {
    props.onDirty();
    const next = props.authors.map((row, i) =>
      i === index ? { ...row, ...patch } : row,
    );
    props.onChange(next);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= props.authors.length) return;
    props.onDirty();
    const rows = [...props.authors];
    const [removed] = rows.splice(index, 1);
    rows.splice(target, 0, removed);
    props.onChange(rows);
  }

  function remove(index: number) {
    if (props.authors.length <= 1) return;
    props.onDirty();
    props.onChange(props.authors.filter((_, i) => i !== index));
  }

  function addAuthor() {
    props.onDirty();
    props.onChange([
      ...props.authors,
      { name: "", affiliation: null, orcid: null },
    ]);
  }

  return (
    <div class="space-y-3">
      <For each={props.authors}>
        {(author, index) => (
          <div
            class="flex flex-col gap-3 rounded-lg border border-border p-3"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-sm font-medium text-ink">
                Author {index() + 1}
              </span>
              <div class="flex gap-1">
                <button
                  type="button"
                  class="siam-btn-secondary px-2 py-1 text-xs"
                  disabled={index() === 0}
                  onClick={() => move(index(), -1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  class="siam-btn-secondary px-2 py-1 text-xs"
                  disabled={index() === props.authors.length - 1}
                  onClick={() => move(index(), 1)}
                >
                  Down
                </button>
                <button
                  type="button"
                  class="siam-btn-secondary px-2 py-1 text-xs"
                  disabled={props.authors.length <= 1}
                  onClick={() => remove(index())}
                >
                  Remove
                </button>
              </div>
            </div>
            <label class="block text-sm">
              <span class="text-ink-muted">Name</span>
              <FormTextInput
                name={`author-name-${index()}`}
                value={author.name}
                onInput={(e) =>
                  updateAuthor(index(), { name: e.currentTarget.value })
                }
              />
            </label>
            <label class="block text-sm">
              <span class="text-ink-muted">Affiliation (optional)</span>
              <FormTextInput
                name={`author-affiliation-${index()}`}
                value={author.affiliation ?? ""}
                onInput={(e) =>
                  updateAuthor(index(), {
                    affiliation: e.currentTarget.value,
                  })
                }
              />
            </label>
            <label class="block text-sm">
              <span class="text-ink-muted">ORCID (optional)</span>
              <FormTextInput
                name={`author-orcid-${index()}`}
                value={author.orcid ?? ""}
                onInput={(e) =>
                  updateAuthor(index(), { orcid: e.currentTarget.value })
                }
              />
            </label>
          </div>
        )}
      </For>
      <button
        type="button"
        class="siam-btn-secondary"
        onClick={() => addAuthor()}
      >
        Add author
      </button>
      <Show when={props.nameError}>
        <p class="text-sm text-red-600" role="alert">{props.nameError}</p>
      </Show>
      <p class="text-sm text-ink-muted">
        Citation line preview:{" "}
        <span class="font-medium text-ink">
          {preview() || "—"}
        </span>
      </p>
    </div>
  );
}
