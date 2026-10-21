import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type { ResearchThemeAdmin } from "~/lib/api/types/admin.types";

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminResearchList() {
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal<string>("");
  const [themeStatus, setThemeStatus] = createSignal<string>("");
  const [featured, setFeatured] = createSignal<string>("");

  const [sortOrderDraft, setSortOrderDraft] = createSignal<
    Record<string, string>
  >({});
  const [sortOrderError, setSortOrderError] = createSignal<string | null>(
    null,
  );

  const themesResource = createResource(
    () => ({
      q: appliedQ() || undefined,
      publishStatus: publishStatus() || undefined,
      themeStatus:
        themeStatus() === "ongoing" || themeStatus() === "completed"
          ? themeStatus()
          : undefined,
      featured:
        featured() === "true"
          ? true
          : featured() === "false"
            ? false
            : undefined,
    }),
    (params) => adminResearchApi.list(params),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    setAppliedQ(q().trim());
  }

  async function commitSortOrder(theme: ResearchThemeAdmin) {
    const raw = sortOrderDraft()[theme.id] ?? String(theme.sortOrder);
    const next = Number.parseInt(raw, 10);
    if (Number.isNaN(next) || next === theme.sortOrder) return;
    setSortOrderError(null);
    try {
      await adminResearchApi.update(theme.id, { sortOrder: next });
      void themesResource[1].refetch();
    } catch (error) {
      setSortOrderError(getApiErrorMessage(error));
    }
  }

  return (
    <ResourceRequest
      resource={themesResource}
      emptyWhen={(themes) => themes.length === 0}
      emptyFallback={
        <EmptyState
          variant="list"
          title="No research themes yet"
          description="Create your first theme to manage research programs from the admin."
        >
          <A href="/admin/research/new" class="siam-btn-primary no-underline">
            New theme
          </A>
        </EmptyState>
      }
    >
      {(themes) => (
        <div>
          <Title>Research themes — SIAM Admin</Title>
          <AdminPageHeader
            title="Research themes"
            description="Draft and published research programs (A04)."
          >
            <A href="/admin/research/new" class="siam-btn-primary no-underline">
              New theme
            </A>
          </AdminPageHeader>

          <form
            class="mt-6 flex flex-wrap items-end gap-3"
            onSubmit={applyFilters}
          >
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Search</span>
              <input
                type="search"
                class="siam-input min-w-[12rem]"
                placeholder="Title or slug"
                value={q()}
                onInput={(e) => setQ(e.currentTarget.value)}
              />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Publish status</span>
              <select
                class="siam-input"
                value={publishStatus()}
                onChange={(e) => setPublishStatus(e.currentTarget.value)}
              >
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Theme status</span>
              <select
                class="siam-input"
                value={themeStatus()}
                onChange={(e) => setThemeStatus(e.currentTarget.value)}
              >
                <option value="">All</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Featured on home</span>
              <select
                class="siam-input"
                value={featured()}
                onChange={(e) => setFeatured(e.currentTarget.value)}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <button type="submit" class="siam-btn-secondary">Apply</button>
          </form>

          <Show when={sortOrderError()}>
            <p class="mt-4 text-sm text-red-600" role="alert">
              {sortOrderError()}
            </p>
          </Show>

          <Show when={themes.length > 0}>
            <div class="mt-6 overflow-x-auto">
              <table class="w-full min-w-[48rem] border-collapse text-left text-sm">
                <thead>
                  <tr class="border-b border-border text-ink-muted">
                    <th class="py-2 pr-4 font-medium">Title</th>
                    <th class="py-2 pr-4 font-medium">Slug</th>
                    <th class="py-2 pr-4 font-medium">Publish</th>
                    <th class="py-2 pr-4 font-medium">Theme</th>
                    <th class="py-2 pr-4 font-medium">Featured</th>
                    <th class="py-2 pr-4 font-medium">Order</th>
                    <th class="py-2 pr-4 font-medium">Updated</th>
                    <th class="py-2 font-medium"> </th>
                  </tr>
                </thead>
                <tbody>
                  <For each={themes}>
                    {(theme: ResearchThemeAdmin) => (
                      <tr class="border-b border-border">
                        <td class="py-3 pr-4 font-medium text-ink">{theme.title}</td>
                        <td class="py-3 pr-4 text-ink-muted">{theme.slug}</td>
                        <td class="py-3 pr-4">{theme.publishStatus}</td>
                        <td class="py-3 pr-4">{theme.themeStatus}</td>
                        <td class="py-3 pr-4">
                          {theme.featuredOnHome ? "Yes" : "No"}
                        </td>
                        <td class="py-3 pr-4">
                          <input
                            type="number"
                            class="siam-input w-20"
                            value={
                              sortOrderDraft()[theme.id] ??
                              String(theme.sortOrder)
                            }
                            onInput={(e) =>
                              setSortOrderDraft((prev) => ({
                                ...prev,
                                [theme.id]: e.currentTarget.value,
                              }))
                            }
                            onBlur={() => void commitSortOrder(theme)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              }
                            }}
                          />
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {formatUpdated(theme.updatedAt)}
                        </td>
                        <td class="py-3">
                          <A
                            href={`/admin/research/${theme.id}`}
                            class="text-link"
                          >
                            Edit
                          </A>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </Show>
        </div>
      )}
    </ResourceRequest>
  );
}
