import { A, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import ProjectPublicDetailView from "~/components/projects/ProjectPublicDetailView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminProjectsApi } from "~/lib/api/endpoints/admin/projects.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { ProjectPublicDetail } from "~/lib/api/types/project.types";

export default function AdminProjectPreview() {
  const params = useParams();
  const projectId = () => params.id ?? "";
  const [detail, setDetail] = createSignal<ProjectPublicDetail | null>(null);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = projectId();
    if (!id) return;
    try {
      setDetail(await adminProjectsApi.preview(id));
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
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={detail()}>
        {(d) => (
          <div>
            <Title>{d().title} — Preview</Title>
            <Meta name="robots" content="noindex" />
            <div
              class="mb-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted"
              role="status"
            >
              Preview — this project is not necessarily published. Public
              visitors will not see it until you publish.
            </div>
            <ProjectPublicDetailView
              detail={d()}
              backHref={`/admin/projects/${projectId()}`}
              backLabel="Back to project"
              showPermalink
            />
          </div>
        )}
      </Show>
    </Show>
  );
}
