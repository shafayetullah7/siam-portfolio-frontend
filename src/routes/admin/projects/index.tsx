import { A, useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import PublishStatusBadge from "~/components/admin/PublishStatusBadge";
import ProjectPublishControls from "~/components/admin/projects/ProjectPublishControls";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import { adminProjectsApi } from "~/lib/api/endpoints/admin/projects.api";
import type { ProjectAdminSummary } from "~/lib/api/types/project.types";
import { PROJECT_TYPES } from "~/lib/forms/schemas/project-write.schema";
import { PROJECT_TYPE_LABELS } from "~/lib/projects/projectLabels";
import { ChevronRight } from "~/icons";

function formatUpdated(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default function AdminProjectsList() {
  const navigate = useNavigate();
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [publishStatus, setPublishStatus] = createSignal("");
  const [projectType, setProjectType] = createSignal("");
  const [featured, setFeatured] = createSignal("");

  const projectsResource = createResource(
    () => ({
      q: appliedQ() || undefined,
      publishStatus: publishStatus() || undefined,
      projectType:
        projectType() && PROJECT_TYPES.includes(projectType() as never)
          ? (projectType() as ProjectAdminSummary["projectType"])
          : undefined,
      featured:
        featured() === "true"
          ? true
          : featured() === "false"
            ? false
            : undefined,
      limit: 100,
    }),
    (params) => adminProjectsApi.list(params),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    setAppliedQ(q().trim());
  }

  return (
    <ResourceRequest
      resource={projectsResource}
      emptyWhen={(items) => items.length === 0}
      emptyFallback={
        <EmptyState
          variant="list"
          title="No projects yet"
          description="Create your first project draft to manage case studies from the admin."
        >
          <A href="/admin/projects/new" class="siam-btn-primary no-underline">
            New project
          </A>
        </EmptyState>
      }
    >
      {(items) => (
        <div>
          <Title>Projects — SIAM Admin</Title>
          <AdminPageHeader
            title="Projects"
            description="Draft and published portfolio projects (A06)."
          >
            <A href="/admin/projects/new" class="siam-btn-primary no-underline">
              New project
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
              <span class="text-ink-muted">Project type</span>
              <select
                class="siam-input"
                value={projectType()}
                onChange={(e) => setProjectType(e.currentTarget.value)}
              >
                <option value="">All</option>
                <For each={PROJECT_TYPES}>
                  {(type) => (
                    <option value={type}>{PROJECT_TYPE_LABELS[type]}</option>
                  )}
                </For>
              </select>
            </label>
            <label class="flex flex-col gap-1 text-sm">
              <span class="text-ink-muted">Featured</span>
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

          <Show when={items.length > 0}>
            <div class="mt-6 overflow-x-auto">
              <table class="w-full min-w-[40rem] border-collapse text-left text-sm">
                <thead>
                  <tr class="border-b border-border text-ink-muted">
                    <th class="py-2 pr-4 font-medium">Title</th>
                    <th class="py-2 pr-4 font-medium">Type</th>
                    <th class="py-2 pr-4 font-medium">Status</th>
                    <th class="py-2 pr-4 font-medium">Updated</th>
                    <th class="py-2 pr-4 font-medium">Featured</th>
                    <th class="py-2 pr-4 font-medium">Actions</th>
                    <th class="w-10 py-2 font-medium" aria-label="Open" />
                  </tr>
                </thead>
                <tbody>
                  <For each={items}>
                    {(project: ProjectAdminSummary) => (
                      <tr
                        class="border-b border-border cursor-pointer transition-colors hover:bg-surface-container-lowest"
                        tabIndex={0}
                        role="link"
                        aria-label={`View ${project.title}`}
                        onClick={() => navigate(`/admin/projects/${project.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/admin/projects/${project.id}`);
                          }
                        }}
                      >
                        <td class="py-3 pr-4 font-medium text-ink">
                          {project.title}
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {PROJECT_TYPE_LABELS[project.projectType]}
                        </td>
                        <td class="py-3 pr-4">
                          <PublishStatusBadge status={project.publishStatus} />
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {formatUpdated(project.updatedAt)}
                        </td>
                        <td class="py-3 pr-4 text-ink-muted">
                          {project.featured ? "Yes" : "—"}
                        </td>
                        <td class="py-3 pr-4">
                          <ProjectPublishControls
                            projectId={project.id}
                            publishStatus={project.publishStatus}
                            variant="compact"
                            onUpdated={() => void projectsResource[1].refetch()}
                          />
                        </td>
                        <td class="py-3 text-ink-muted">
                          <ChevronRight class="size-4" aria-hidden="true" />
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
