import { useSubmission } from "@solidjs/router";
import { For, Show } from "solid-js";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import FormTextInput from "~/components/forms/FormTextInput";
import {
  addNavItemAction,
  saveNavRowAction,
} from "~/lib/forms/actions/admin-site.actions";
import type { FormActionResult } from "~/lib/forms/types";
import type { NavItemAdmin } from "~/lib/api/types/admin.types";
import { navPathPublishWarning } from "~/lib/site/navPathWarning";

function resultMessage(result: FormActionResult | undefined): string | null {
  if (result && !result.ok) return result.formMessage;
  return null;
}

export type AdminSiteNavigationPanelProps = {
  navItems: NavItemAdmin[];
  setNavItems: (
    updater: (prev: NavItemAdmin[]) => NavItemAdmin[],
  ) => void;
  publishedSlugs: ReadonlySet<string>;
};

export default function AdminSiteNavigationPanel(props: AdminSiteNavigationPanelProps) {
  const addNavSubmission = useSubmission(addNavItemAction);
  const navRowSubmission = useSubmission(saveNavRowAction);

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

  return (
    <div class="space-y-4">
      <div class="space-y-2 text-sm text-ink-muted">
        <p>
          The public header always includes core hubs (Research, Publications,
          Projects, and Focus on the home page). Writing and Achievements appear when
          those sections have published content. Items below add{" "}
          <strong class="font-medium text-ink">custom links</strong> from your nav
          list.
        </p>
        <p>
          Links only appear when the path is on the live sitemap and the destination
          is a real public route. Custom paths must match a published module or CMS
          page—paths with no public renderer will 404.
        </p>
      </div>
      <FormErrorAlert message={navRowMessage()} />
      <ul class="m-0 list-none space-y-4 p-0">
        <For each={props.navItems}>
          {(item) => {
            const warning = () =>
              navPathPublishWarning(item.path, props.publishedSlugs);
            return (
              <li>
                <form
                  class="siam-card space-y-2 p-4"
                  action={saveNavRowAction.with(item.id)}
                  method="post"
                >
                  <div class="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label class="mb-1 block text-xs font-medium text-ink-muted">
                        Label
                      </label>
                      <FormTextInput
                        name="label"
                        value={item.label}
                        onInput={(e) =>
                          props.setNavItems((prev) =>
                            prev.map((n) =>
                              n.id === item.id
                                ? { ...n, label: e.currentTarget.value }
                                : n,
                            ),
                          )
                        }
                      />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs font-medium text-ink-muted">
                        Path
                      </label>
                      <FormTextInput
                        name="path"
                        value={item.path}
                        onInput={(e) =>
                          props.setNavItems((prev) =>
                            prev.map((n) =>
                              n.id === item.id
                                ? { ...n, path: e.currentTarget.value }
                                : n,
                            ),
                          )
                        }
                      />
                    </div>
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
                          props.setNavItems((prev) =>
                            prev.map((n) =>
                              n.id === item.id
                                ? {
                                    ...n,
                                    sortOrder: Number(e.currentTarget.value),
                                  }
                                : n,
                            ),
                          )
                        }
                      />
                    </label>
                    <label class="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="visible"
                        checked={item.visible}
                        onChange={(e) =>
                          props.setNavItems((prev) =>
                            prev.map((n) =>
                              n.id === item.id
                                ? { ...n, visible: e.currentTarget.checked }
                                : n,
                            ),
                          )
                        }
                      />
                      Visible in nav
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
        class="siam-card space-y-3 p-4"
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
    </div>
  );
}
