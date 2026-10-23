import { A, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import WritingArticleDetailView from "~/components/writing/WritingArticleDetailView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminWritingApi } from "~/lib/api/endpoints/admin/writing.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { WritingPublicDetail } from "~/lib/api/types/writing.types";

export default function AdminWritingPreview() {
  const params = useParams();
  const articleId = () => params.id ?? "";
  const [detail, setDetail] = createSignal<WritingPublicDetail | null>(null);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = articleId();
    if (!id) return;
    try {
      setDetail(await adminWritingApi.preview(id));
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
          title="Article not found"
          description="This article may have been deleted or the link is wrong."
        >
          <A href="/admin/writing" class="siam-btn-primary no-underline">
            Back to writing
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
              Preview — this article is not necessarily published. Public
              visitors will not see it until you publish.
            </div>
            <WritingArticleDetailView
              detail={d()}
              backHref={`/admin/writing/${articleId()}`}
              backLabel="Back to article"
              showPermalink
            />
          </div>
        )}
      </Show>
    </Show>
  );
}
