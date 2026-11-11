import { createSignal, For, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminTalksApi } from "~/lib/api/endpoints/admin/talks.api";
import type { TalkResourceAdmin, TalkResourceType } from "~/lib/api/types/talks.types";
import { getApiErrorMessage } from "~/lib/api/errors";
import {
  TALK_RESOURCE_TYPE_LABELS,
} from "~/lib/talks/talkLabels";

export type TalkResourceDraft = {
  label: string;
  url: string;
  resourceType: TalkResourceType;
};

export type TalkResourcesEditorProps = {
  talkId: string;
  initial: TalkResourceAdmin[];
  onSaved?: (resources: TalkResourceAdmin[]) => void;
};

function toDraft(row: TalkResourceAdmin): TalkResourceDraft {
  return {
    label: row.label,
    url: row.url,
    resourceType: row.resourceType,
  };
}

export default function TalkResourcesEditor(props: TalkResourcesEditorProps) {
  const [rows, setRows] = createSignal<TalkResourceDraft[]>(
    props.initial.map(toDraft),
  );
  const [pending, setPending] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [saved, setSaved] = createSignal(false);

  function addRow() {
    setRows((prev) => [
      ...prev,
      { label: "", url: "", resourceType: "slides" },
    ]);
    setSaved(false);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  function patchRow(index: number, patch: Partial<TalkResourceDraft>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
    setSaved(false);
  }

  async function saveResources() {
    setPending(true);
    setError(null);
  setSaved(false);
    try {
      const detail = await adminTalksApi.putResources(props.talkId, {
        resources: rows().map((r) => ({
          label: r.label.trim(),
          url: r.url.trim(),
          resourceType: r.resourceType,
        })),
      });
      setRows(detail.resources.map(toDraft));
      props.onSaved?.(detail.resources);
      setSaved(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <section class="rounded-lg border border-border p-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-lg font-semibold text-ink">Materials</h2>
        <button type="button" class="siam-btn-secondary text-sm" onClick={addRow}>
          Add link
        </button>
      </div>
      <Show when={error()}>
        <div class="mt-3">
          <FormErrorAlert message={error()!} />
        </div>
      </Show>
      <Show when={saved()}>
        <p class="mt-3 text-sm text-green-700" role="status">
          Materials saved.
        </p>
      </Show>
      <div class="mt-4 space-y-3">
        <For each={rows()}>
          {(row, index) => (
            <div class="grid gap-2 rounded border border-border/60 p-3 md:grid-cols-12">
              <label class="md:col-span-3 text-sm">
                <span class="text-ink-muted">Label</span>
                <input
                  class="siam-input mt-1 w-full"
                  value={row.label}
                  onInput={(e) =>
                    patchRow(index(), { label: e.currentTarget.value })
                  }
                />
              </label>
              <label class="md:col-span-5 text-sm">
                <span class="text-ink-muted">HTTPS URL</span>
                <input
                  class="siam-input mt-1 w-full"
                  type="url"
                  value={row.url}
                  onInput={(e) =>
                    patchRow(index(), { url: e.currentTarget.value })
                  }
                />
              </label>
              <label class="md:col-span-3 text-sm">
                <span class="text-ink-muted">Type</span>
                <select
                  class="siam-input mt-1 w-full"
                  value={row.resourceType}
                  onChange={(e) =>
                    patchRow(index(), {
                      resourceType: e.currentTarget.value as TalkResourceType,
                    })
                  }
                >
                  <For each={Object.entries(TALK_RESOURCE_TYPE_LABELS)}>
                    {([value, label]) => (
                      <option value={value}>{label}</option>
                    )}
                  </For>
                </select>
              </label>
              <button
                type="button"
                class="siam-btn-ghost text-sm md:col-span-1 md:self-end"
                onClick={() => removeRow(index())}
              >
                Remove
              </button>
            </div>
          )}
        </For>
        <Show when={rows().length === 0}>
          <p class="text-sm text-ink-muted">No materials yet.</p>
        </Show>
      </div>
      <button
        type="button"
        class="siam-btn-primary mt-4"
        disabled={pending()}
        onClick={saveResources}
      >
        {pending() ? "Saving…" : "Save materials"}
      </button>
    </section>
  );
}
