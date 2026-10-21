import { createEffect, createSignal, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import {
  adminMediaApi,
  getMediaAdminErrorMessage,
} from "~/lib/api/endpoints/admin/media.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type { MediaAdmin } from "~/lib/api/types/admin.types";
import MediaAssetThumb from "./MediaAssetThumb";
import { formatMediaBytes } from "./media-upload";

export type MediaMetadataPanelProps = {
  mediaId: string | null;
  onUpdated: (item: MediaAdmin) => void;
  onDeleted: () => void;
  onClose: () => void;
};

export default function MediaMetadataPanel(props: MediaMetadataPanelProps) {
  const [item, setItem] = createSignal<MediaAdmin | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const [alt, setAlt] = createSignal("");
  const [caption, setCaption] = createSignal("");
  const [license, setLicense] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = createSignal(false);
  const [deleting, setDeleting] = createSignal(false);
  const [deleteError, setDeleteError] = createSignal<string | null>(null);

  createEffect(() => {
    const id = props.mediaId;
    setDeleteConfirm(false);
    setDeleteError(null);
    setSaveError(null);
    if (!id) {
      setItem(null);
      return;
    }
    setLoading(true);
    setLoadError(null);
    adminMediaApi
      .get(id)
      .then((row) => {
        setItem(row);
        setAlt(row.alt ?? "");
        setCaption(row.caption ?? "");
        setLicense(row.license ?? "");
      })
      .catch((err) => {
        setItem(null);
        setLoadError(getApiErrorMessage(err));
      })
      .finally(() => setLoading(false));
  });

  async function save() {
    const id = props.mediaId;
    if (!id) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await adminMediaApi.update(id, {
        alt: alt().trim() || null,
        caption: caption().trim() || null,
        license: license().trim() || null,
      });
      setItem(updated);
      props.onUpdated(updated);
    } catch (err) {
      setSaveError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function deleteAsset() {
    const id = props.mediaId;
    if (!id) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await adminMediaApi.delete(id);
      props.onDeleted();
      props.onClose();
    } catch (err) {
      setDeleteError(getMediaAdminErrorMessage(err));
      setDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Show when={props.mediaId}>
      <aside class="siam-card flex flex-col gap-4 p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
        <div class="flex items-start justify-between gap-2">
          <h2 class="text-sm font-semibold text-ink">File details</h2>
          <button
            type="button"
            class="text-sm text-ink-muted hover:text-ink"
            onClick={() => props.onClose()}
          >
            Close
          </button>
        </div>

        <Show when={loading()}>
          <p class="text-sm text-ink-muted">Loading…</p>
        </Show>
        <FormErrorAlert message={loadError()} />

        <Show when={!loading() && item()}>
          <>
              <div class="max-w-[200px]">
                <MediaAssetThumb
                  url={item()!.url}
                  fileName={item()!.fileName}
                  mimeType={item()!.mimeType}
                />
              </div>
              <p class="text-xs text-ink-muted break-all">{item()!.fileName}</p>
              <p class="text-xs text-ink-muted">
                {item()!.mimeType ?? "Unknown type"} · {formatMediaBytes(item()!.size)}
              </p>
              <Show when={(item()?.usesCount ?? 0) > 0}>
                <p class="siam-alert-error text-xs" role="status">
                  In use ({item()!.usesCount}) — remove references before deleting.
                </p>
              </Show>

              <form
                class="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
              >
                <FormField label="Alt text" name="alt">
                  <FormTextInput
                    name="alt"
                    value={alt()}
                    onInput={(e) => setAlt(e.currentTarget.value)}
                  />
                </FormField>
                <FormField label="Caption" name="caption">
                  <FormTextarea
                    name="caption"
                    rows={3}
                    value={caption()}
                    onInput={(e) => setCaption(e.currentTarget.value)}
                  />
                </FormField>
                <FormField label="License" name="license">
                  <FormTextInput
                    name="license"
                    value={license()}
                    onInput={(e) => setLicense(e.currentTarget.value)}
                  />
                </FormField>
                <FormErrorAlert message={saveError()} />
                <button
                  type="submit"
                  class="siam-btn-primary w-full"
                  disabled={saving()}
                >
                  {saving() ? "Saving…" : "Save metadata"}
                </button>
              </form>

              <div class="border-t border-border pt-4">
                <Show
                  when={!deleteConfirm()}
                  fallback={
                    <div class="space-y-2">
                      <p class="text-sm text-ink">Delete this file permanently?</p>
                      <FormErrorAlert message={deleteError()} />
                      <div class="flex gap-2">
                        <button
                          type="button"
                          class="siam-btn-secondary flex-1 text-sm"
                          disabled={deleting()}
                          onClick={() => setDeleteConfirm(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          class="flex-1 rounded-lg bg-error px-3 py-2 text-sm font-medium text-on-error hover:opacity-90 disabled:opacity-50"
                          disabled={deleting() || (item()?.usesCount ?? 0) > 0}
                          onClick={() => deleteAsset()}
                        >
                          {deleting() ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  }
                >
                  <button
                    type="button"
                    class="w-full text-sm text-error hover:underline disabled:opacity-50"
                    disabled={(item()?.usesCount ?? 0) > 0}
                    onClick={() => setDeleteConfirm(true)}
                  >
                    Delete file
                  </button>
                </Show>
              </div>
          </>
        </Show>
      </aside>
    </Show>
  );
}
