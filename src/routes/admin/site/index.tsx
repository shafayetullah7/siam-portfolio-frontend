import { useSubmission } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import MediaPicker from "~/components/admin/media/MediaPicker";
import type { MediaPickerSelection } from "~/components/admin/media/media-picker.types";
import { adminPagesApi } from "~/lib/api/endpoints/admin/pages.api";
import { adminSiteApi } from "~/lib/api/endpoints/admin/site.api";
import type { NavItemAdmin } from "~/lib/api/types/admin.types";
import { getAuthFormErrorMessage } from "~/lib/api/errors";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormField from "~/components/forms/FormField";
import FormSuccessNotice from "~/components/forms/FormSuccessNotice";
import FormTextInput from "~/components/forms/FormTextInput";
import FormTextarea from "~/components/forms/FormTextarea";
import {
  addNavItemAction,
  saveNavRowAction,
  saveSiteSettingsAction,
} from "~/lib/forms/actions/admin-site.actions";
import type { FormActionResult } from "~/lib/forms/types";
import { useUnsavedChanges } from "~/lib/forms/useUnsavedChanges";
import { navPathPublishWarning } from "~/lib/site/navPathWarning";

function resultMessage(result: FormActionResult | undefined): string | null {
  if (result && !result.ok) return result.formMessage;
  return null;
}

function resultFieldErrors(
  result: FormActionResult | undefined,
): Record<string, string> {
  if (result && !result.ok && result.fieldErrors) return result.fieldErrors;
  return {};
}

export default function AdminSiteSettings() {
  const settingsSubmission = useSubmission(saveSiteSettingsAction);
  const addNavSubmission = useSubmission(addNavItemAction);
  const navRowSubmission = useSubmission(saveNavRowAction);

  const [siteName, setSiteName] = createSignal("");
  const [defaultMetaDescription, setDefaultMetaDescription] = createSignal("");
  const [footerText, setFooterText] = createSignal("");
  const [faviconUrl, setFaviconUrl] = createSignal("");
  const [faviconMediaId, setFaviconMediaId] = createSignal<string | null>(null);
  const [faviconPickerOpen, setFaviconPickerOpen] = createSignal(false);
  const [dirty, setDirty] = createSignal(false);
  const [settingsSaved, setSettingsSaved] = createSignal(false);

  const [navItems, setNavItems] = createSignal<NavItemAdmin[]>([]);
  const [publishedSlugs, setPublishedSlugs] = createSignal<Set<string>>(
    new Set(),
  );
  const [loadError, setLoadError] = createSignal<string | null>(null);

  useUnsavedChanges(dirty);

  const settingsErrors = () =>
    resultFieldErrors(settingsSubmission.result as FormActionResult | undefined);
  const settingsMessage = () => {
    const fromResult = resultMessage(
      settingsSubmission.result as FormActionResult | undefined,
    );
    if (fromResult) return fromResult;
    if (settingsSubmission.error) return settingsSubmission.error.message;
    return null;
  };

  const addNavMessage = () => {
    const fromResult = resultMessage(
      addNavSubmission.result as FormActionResult | undefined,
    );
    if (fromResult) return fromResult;
    if (addNavSubmission.error) return addNavSubmission.error.message;
    return null;
  };

  const navRowMessage = () => {
    const fromResult = resultMessage(
      navRowSubmission.result as FormActionResult | undefined,
    );
    if (fromResult) return fromResult;
    if (navRowSubmission.error) return navRowSubmission.error.message;
    return null;
  };

  async function reloadNav() {
    const nav = await adminSiteApi.listNav();
    setNavItems(nav);
  }

  onMount(async () => {
    try {
      const [settings, nav, pages] = await Promise.all([
        adminSiteApi.getSettings(),
        adminSiteApi.listNav(),
        adminPagesApi.list(),
      ]);
      setSiteName(settings.siteName);
      setDefaultMetaDescription(settings.defaultMetaDescription ?? "");
      setFooterText(settings.footerText ?? "");
      setFaviconUrl(settings.faviconUrl ?? "");
      setFaviconMediaId(settings.faviconMediaId ?? null);
      setNavItems(nav);
      setPublishedSlugs(
        new Set(
          pages
            .filter((p) => p.publishStatus === "published")
            .map((p) => p.slug),
        ),
      );
    } catch (e) {
      setLoadError(getAuthFormErrorMessage(e).formMessage);
    }
  });

  createEffect(() => {
    const r = settingsSubmission.result as FormActionResult | undefined;
    if (r?.ok) {
      setDirty(false);
      setSettingsSaved(true);
    }
  });

  createEffect(() => {
    const r = addNavSubmission.result as FormActionResult | undefined;
    if (r?.ok) {
      void reloadNav();
    }
  });

  createEffect(() => {
    const r = navRowSubmission.result as FormActionResult | undefined;
    if (r?.ok) {
      void reloadNav();
    }
  });

  const slugs = () => publishedSlugs();

  return (
    <div class="max-w-3xl space-y-12">
      <Title>Site settings — SIAM Admin</Title>
      <AdminPageHeader
        title="Site settings"
        description="Brand, metadata, and primary navigation."
      />
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>

      <section>
        <h2 class="text-lg font-semibold text-ink">Brand &amp; metadata</h2>
        <form
          class="mt-4 space-y-4"
          action={saveSiteSettingsAction}
          method="post"
          onInput={() => {
            setDirty(true);
            setSettingsSaved(false);
          }}
        >
          <FormField
            label="Site name"
            name="siteName"
            error={settingsErrors().siteName}
          >
            <FormTextInput
              name="siteName"
              value={siteName()}
              onInput={(e) => setSiteName(e.currentTarget.value)}
              error={settingsErrors().siteName}
            />
          </FormField>
          <FormField label="Default meta description" name="defaultMetaDescription">
            <FormTextarea
              name="defaultMetaDescription"
              rows={2}
              value={defaultMetaDescription()}
              onInput={(e) => setDefaultMetaDescription(e.currentTarget.value)}
            />
          </FormField>
          <FormField label="Footer text" name="footerText">
            <FormTextarea
              name="footerText"
              rows={2}
              value={footerText()}
              onInput={(e) => setFooterText(e.currentTarget.value)}
            />
          </FormField>
          <FormField label="Favicon" name="favicon">
            <div class="space-y-3">
              <Show when={faviconUrl()}>
                <img
                  src={faviconUrl()!}
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
                <Show when={faviconMediaId()}>
                  <button
                    type="button"
                    class="siam-btn-secondary text-sm"
                    onClick={() => {
                      setFaviconMediaId(null);
                      setDirty(true);
                      setSettingsSaved(false);
                    }}
                  >
                    Clear library pick
                  </button>
                </Show>
              </div>
              <input
                type="hidden"
                name="faviconMediaId"
                value={faviconMediaId() ?? ""}
              />
              <details class="text-sm">
                <summary class="cursor-pointer text-ink-muted">
                  External favicon URL (optional)
                </summary>
                <div class="mt-2">
                  <FormTextInput
                    name="faviconUrl"
                    value={faviconUrl()}
                    onInput={(e) => {
                      setFaviconUrl(e.currentTarget.value);
                      setFaviconMediaId(null);
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
              setFaviconMediaId(selection.id);
              setFaviconUrl(selection.url);
              setFaviconPickerOpen(false);
              setDirty(true);
              setSettingsSaved(false);
            }}
          />
          <FormErrorAlert message={settingsMessage()} />
          <FormSuccessNotice
            message={settingsSaved() ? "Settings saved." : null}
          />
          <button
            type="submit"
            class="siam-btn-primary"
            disabled={settingsSubmission.pending}
          >
            {settingsSubmission.pending ? "Saving…" : "Save settings"}
          </button>
        </form>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-ink">Navigation</h2>
        <p class="mt-1 text-sm text-ink-muted">
          Public header/footer only show links whose path appears in the live sitemap.
        </p>
        <FormErrorAlert message={navRowMessage()} />
        <ul class="mt-4 space-y-4">
          <For each={navItems()}>
            {(item) => {
              const warning = () =>
                navPathPublishWarning(item.path, slugs());
              return (
                <li>
                  <form
                    class="siam-card space-y-2 p-4"
                    action={saveNavRowAction.with(item.id)}
                    method="post"
                  >
                    <div class="grid gap-2 sm:grid-cols-2">
                      <FormTextInput
                        name="label"
                        value={item.label}
                        onInput={(e) =>
                          setNavItems((prev) =>
                            prev.map((n) =>
                              n.id === item.id
                                ? { ...n, label: e.currentTarget.value }
                                : n,
                            ),
                          )}
                      />
                      <FormTextInput
                        name="path"
                        value={item.path}
                        onInput={(e) =>
                          setNavItems((prev) =>
                            prev.map((n) =>
                              n.id === item.id
                                ? { ...n, path: e.currentTarget.value }
                                : n,
                            ),
                          )}
                      />
                    </div>
                    <div class="flex flex-wrap items-center gap-4">
                      <label class="flex items-center gap-2 text-sm">
                        Sort
                        <FormTextInput
                          type="number"
                          name="sortOrder"
                          class="w-20"
                          value={String(item.sortOrder)}
                          onInput={(e) =>
                            setNavItems((prev) =>
                              prev.map((n) =>
                                n.id === item.id
                                  ? {
                                      ...n,
                                      sortOrder: Number(e.currentTarget.value),
                                    }
                                  : n,
                              ),
                            )}
                        />
                      </label>
                      <label class="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          name="visible"
                          checked={item.visible}
                          onChange={(e) =>
                            setNavItems((prev) =>
                              prev.map((n) =>
                                n.id === item.id
                                  ? { ...n, visible: e.currentTarget.checked }
                                  : n,
                              ),
                            )}
                        />
                        Visible
                      </label>
                      <button
                        type="submit"
                        class="siam-btn-secondary text-sm"
                        disabled={navRowSubmission.pending}
                      >
                        Save row
                      </button>
                    </div>
                    <Show when={warning()}>
                      <p class="text-sm text-amber-700" role="status">
                        {warning()}
                      </p>
                    </Show>
                  </form>
                </li>
              );
            }}
          </For>
        </ul>

        <form
          class="mt-6 siam-card space-y-3 p-4"
          action={addNavItemAction}
          method="post"
        >
          <p class="text-sm font-medium text-ink">Add nav item</p>
          <FormTextInput name="label" placeholder="Label" />
          <FormTextInput name="path" placeholder="/about" />
          <input type="hidden" name="sortOrder" value="0" />
          <FormErrorAlert message={addNavMessage()} />
          <button
            type="submit"
            class="siam-btn-primary"
            disabled={addNavSubmission.pending}
          >
            {addNavSubmission.pending ? "Adding…" : "Add"}
          </button>
        </form>
      </section>
    </div>
  );
}
