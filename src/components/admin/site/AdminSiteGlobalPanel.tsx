import { createSignal, Show } from "solid-js";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import { emptyToNull } from "~/lib/admin/site/site-settings-form";
import { saveSiteSettingsPanel } from "~/lib/admin/site/saveSiteSettingsPanel";

export type AdminSiteGlobalPanelProps = {
  siteName: string;
  setSiteName: (v: string) => void;
  defaultMetaDescription: string;
  setDefaultMetaDescription: (v: string) => void;
  footerText: string;
  setFooterText: (v: string) => void;
  faviconUrl: string;
  setFaviconUrl: (v: string) => void;
  faviconMediaId: string | null;
  setFaviconMediaId: (v: string | null) => void;
  onDirty: () => void;
  onSaved: () => void;
};

export default function AdminSiteGlobalPanel(props: AdminSiteGlobalPanelProps) {
  const [faviconPickerOpen, setFaviconPickerOpen] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [success, setSuccess] = createSignal(false);

  async function handleSave(e: Event) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setFieldErrors({});
    setSuccess(false);
    const result = await saveSiteSettingsPanel("global", {
      siteName: props.siteName.trim(),
      defaultMetaDescription: emptyToNull(props.defaultMetaDescription),
      footerText: emptyToNull(props.footerText),
      faviconUrl: emptyToNull(props.faviconUrl),
      faviconMediaId: props.faviconMediaId,
    });
    setSaving(false);
    if (result.ok) {
      setSuccess(true);
      props.onSaved();
      return;
    }
    setMessage(result.formMessage);
    setFieldErrors(result.fieldErrors ?? {});
  }

  return (
    <form class="space-y-4" onSubmit={handleSave}>
      <FormField label="Site name" name="siteName" error={fieldErrors().siteName}>
        <FormTextInput
          name="siteName"
          value={props.siteName}
          onInput={(e) => {
            props.setSiteName(e.currentTarget.value);
            props.onDirty();
            setSuccess(false);
          }}
          error={fieldErrors().siteName}
        />
      </FormField>
      <FormField
        label="Default meta description"
        name="defaultMetaDescription"
        hint="Fallback SEO description when a page has none. Home has its own SEO under Edit home."
      >
        <FormTextarea
          name="defaultMetaDescription"
          rows={2}
          value={props.defaultMetaDescription}
          onInput={(e) => {
            props.setDefaultMetaDescription(e.currentTarget.value);
            props.onDirty();
            setSuccess(false);
          }}
        />
      </FormField>
      <FormField
        label="Footer text"
        name="footerText"
        hint="Shown in the public site footer when set."
      >
        <FormTextarea
          name="footerText"
          rows={2}
          value={props.footerText}
          onInput={(e) => {
            props.setFooterText(e.currentTarget.value);
            props.onDirty();
            setSuccess(false);
          }}
        />
      </FormField>
      <FormField label="Favicon" name="favicon">
        <div class="space-y-3">
          <Show when={props.faviconUrl}>
            <img
              src={props.faviconUrl}
              alt=""
              class="h-10 w-10 rounded border border-border object-contain bg-surface"
            />
          </Show>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="siam-btn-secondary text-sm"
              onClick={() => setFaviconPickerOpen(true)}
            >
              Choose from library
            </button>
            <Show when={props.faviconMediaId}>
              <button
                type="button"
                class="siam-btn-secondary text-sm"
                onClick={() => {
                  props.setFaviconMediaId(null);
                  props.onDirty();
                  setSuccess(false);
                }}
              >
                Clear library pick
              </button>
            </Show>
          </div>
          <details class="text-sm">
            <summary class="cursor-pointer text-ink-muted">
              External favicon URL (optional)
            </summary>
            <div class="mt-2">
              <FormTextInput
                name="faviconUrl"
                value={props.faviconUrl}
                onInput={(e) => {
                  props.setFaviconUrl(e.currentTarget.value);
                  props.setFaviconMediaId(null);
                  props.onDirty();
                  setSuccess(false);
                }}
              />
              <p class="mt-1 text-xs text-ink-muted">
                Used when no library image is selected. Library pick overrides
                this on save.
              </p>
            </div>
          </details>
        </div>
      </FormField>
      <MediaPicker
        open={faviconPickerOpen()}
        imagesOnly
        onClose={() => setFaviconPickerOpen(false)}
        onSelect={(selection: MediaPickerSelection) => {
          props.setFaviconMediaId(selection.id);
          props.setFaviconUrl(selection.url);
          setFaviconPickerOpen(false);
          props.onDirty();
          setSuccess(false);
        }}
      />
      <FormErrorAlert message={message()} />
      <FormSuccessNotice message={success() ? "Global settings saved." : null} />
      <button type="submit" class="siam-btn-primary" disabled={saving()}>
        {saving() ? "Saving…" : "Save global settings"}
      </button>
    </form>
  );
}
