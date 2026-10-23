import { A, useNavigate, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import AdminWritingView from "~/components/admin/writing/AdminWritingView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminWritingApi } from "~/lib/api/endpoints/admin/writing.api";
import type { WritingAdminDetail } from "~/lib/api/types/writing.types";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";

export default function AdminWritingViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const articleId = () => params.id ?? "";

  const [article, setArticle] = createSignal<WritingAdminDetail | null>(null);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = articleId();
    if (id === "new") {
      navigate("/admin/writing/new", { replace: true });
      return;
    }
    if (!id) return;
    try {
      setArticle(await adminWritingApi.get(id));
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
      <Title>{article()?.title ?? "Article"} — SIAM Admin</Title>
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={article()}>
        {(row) => (
          <AdminWritingView
            article={row()}
            onArticleUpdated={setArticle}
          />
        )}
      </Show>
    </Show>
  );
}
