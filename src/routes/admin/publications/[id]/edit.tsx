import { A, useNavigate, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import PublicationEditorForm from "~/components/admin/publications/PublicationEditorForm";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import type { PublicationAdminSummary } from "~/lib/api/endpoints/admin/publications.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";

export default function AdminPublicationEdit() {
  const params = useParams();
  const navigate = useNavigate();
  const publicationId = () => params.id ?? "";

  const [initial, setInitial] = createSignal<PublicationAdminSummary | null>(
    null,
  );
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = publicationId();
    if (id === "new") {
      navigate("/admin/publications/new", { replace: true });
      return;
    }
    if (!id) return;
    try {
      setInitial(await adminPublicationsApi.get(id));
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
          title="Publication not found"
          description="This publication may have been deleted or the link is wrong."
        >
          <A href="/admin/publications" class="siam-btn-primary no-underline">
            Back to publications
          </A>
        </EmptyState>
      }
    >
      <Title>Edit publication — SIAM Admin</Title>
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={initial()}>
        {(row) => (
          <PublicationEditorForm
            mode="edit"
            publicationId={publicationId()}
            initial={row()}
            onSaved={setInitial}
          />
        )}
      </Show>
    </Show>
  );
}
