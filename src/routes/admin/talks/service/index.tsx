import { A } from "@solidjs/router";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminAcademicServiceApi } from "~/lib/api/endpoints/admin/academic-service.api";
import type { AcademicServiceAdmin } from "~/lib/api/types/talks.types";
import {
  ACADEMIC_SERVICE_TYPE_LABELS,
  ACADEMIC_SERVICE_TYPES,
} from "~/lib/talks/talkLabels";
import { ChevronRight } from "~/icons";

export default function AdminAcademicServiceList() {
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal("");
  const [serviceType, setServiceType] = createSignal("");

  const listResource = createResource(
    () => ({
      q: appliedQ() || undefined,
      publishStatus: publishStatus() || undefined,
      serviceType:
        serviceType() && ACADEMIC_SERVICE_TYPES.includes(serviceType() as never)
          ? serviceType()
          : undefined,
      page: 1,
      limit: 24,
    }),
    (params) => adminAcademicServiceApi.list(params),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    setAppliedQ(q().trim());
  }

  return (
    <ResourceRequest
      resource={listResource}
      emptyWhen={(data) => data.items.length === 0}
      emptyFallback={
        <EmptyState variant="list" title="No service entries yet">
          <A href="/admin/talks/service/new" class="siam-btn-primary no-underline">
            New entry
          </A>
        </EmptyState>
      }
    >
      {(data) => (
        <div>
          <AdminPageHeader title="Academic service" description="Reviewing, committees, and outreach.">
            <A href="/admin/talks/service/new" class="siam-btn-primary no-underline">
              New entry
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
                value={q()}
                onInput={(e) => setQ(e.currentTarget.value)}
              />
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Type</span>
              <select
                class="siam-input"
                value={serviceType()}
                onChange={(e) => setServiceType(e.currentTarget.value)}
              >
                <option value="">All</option>
                <For each={ACADEMIC_SERVICE_TYPES}>
                  {(t) => (
                    <option value={t}>{ACADEMIC_SERVICE_TYPE_LABELS[t]}</option>
                  )}
                </For>
              </select>
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Status</span>
              <select
                class="siam-input"
                value={publishStatus()}
                onChange={(e) => setPublishStatus(e.currentTarget.value)}
              >
                <option value="">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <button type="submit" class="siam-btn-secondary">
              Apply
            </button>
          </form>

          <Show when={data.items.length > 0}>
            <table class="mt-6 w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-border text-ink-muted">
                  <th class="py-2 pr-4">Organization</th>
                  <th class="py-2 pr-4">Role</th>
                  <th class="py-2 pr-4">Type</th>
                  <th class="py-2 pr-4">Status</th>
                  <th class="w-8" />
                </tr>
              </thead>
              <tbody>
                <For each={data.items}>
                  {(row: AcademicServiceAdmin) => (
                    <tr class="border-b border-border/60">
                      <td class="py-3 pr-4 font-medium">{row.organization}</td>
                      <td class="py-3 pr-4">{row.roleTitle}</td>
                      <td class="py-3 pr-4 text-ink-muted">
                        {ACADEMIC_SERVICE_TYPE_LABELS[row.serviceType]}
                      </td>
                      <td class="py-3 pr-4">
                        <PublishStatusBadge status={row.publishStatus} />
                      </td>
                      <td class="py-3">
                        <A href={`/admin/talks/service/${row.id}/edit`}>
                          <ChevronRight class="size-5 text-primary" />
                        </A>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </Show>
        </div>
      )}
    </ResourceRequest>
  );
}
