import { A, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import PublicationPublicDetailView from "~/components/publications/PublicationPublicDetailView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminPublicationsApi } from "~/lib/api/endpoints/admin/publications.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { PublicationPublicDetail } from "~/lib/api/types/publication.types";

export default function AdminPublicationPreview() {
  const params = useParams();
  const publicationId = () => params.id ?? "";
  const [detail, setDetail] = createSignal<PublicationPublicDetail | null>(
    null,
  );
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = publicationId();
    if (!id) return;
    try {
      setDetail(await adminPublicationsApi.preview(id));
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
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={detail()}>
        {(d) => (
          <div>
            <Title>{d().seoTitle ?? d().title} — Preview</Title>
            <Show when={d().seoDescription}>
              <Meta name="description" content={d().seoDescription ?? ""} />
            </Show>
            <div
              class="mb-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted"
              role="status"
            >
              Preview — this publication is not necessarily published. Public
              visitors will not see it until you publish.
            </div>
            <PublicationPublicDetailView
              detail={d()}
              backHref={`/admin/publications/${publicationId()}`}
              backLabel="Back to publication"
            />
          </div>
        )}
      </Show>
    </Show>
  );
}
