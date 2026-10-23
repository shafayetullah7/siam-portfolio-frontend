import { A, useNavigate, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import AdminProjectView from "~/components/admin/projects/AdminProjectView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminProjectsApi } from "~/lib/api/endpoints/admin/projects.api";
import type { ProjectAdminSummary } from "~/lib/api/types/project.types";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";

export default function AdminProjectViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = () => params.id ?? "";

  const [project, setProject] = createSignal<ProjectAdminSummary | null>(null);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = projectId();
    if (id === "new") {
      navigate("/admin/projects/new", { replace: true });
      return;
    }
    if (!id) return;
    try {
      setProject(await adminProjectsApi.get(id));
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        setNotFound(true);
        return;
      }
      setLoadError(getApiErrorMessage(error));
    }
  });

  return (
    <Show
      when={!notFound()}
      fallback={
        <EmptyState
          variant="list"
          title="Project not found"
          description="This project may have been deleted or the link is wrong."
        >
          <A href="/admin/projects" class="siam-btn-primary no-underline">
            Back to projects
          </A>
        </EmptyState>
      }
    >
      <Title>{project()?.title ?? "Project"} — SIAM Admin</Title>
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={project()}>
        {(row) => (
          <AdminProjectView
            project={row()}
            onProjectUpdated={setProject}
          />
        )}
      </Show>
    </Show>
  );
}
