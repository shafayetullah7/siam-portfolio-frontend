import { A, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import ResearchThemeDetailView from "~/components/research/ResearchThemeDetailView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminResearchApi } from "~/lib/api/endpoints/admin/research.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { ResearchThemeDetailPublic } from "~/lib/api/types/research.types";

export default function AdminResearchPreview() {
  const params = useParams();
  const themeId = () => params.id ?? "";
  const [theme, setTheme] = createSignal<ResearchThemeDetailPublic | null>(
    null,
  );
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    if (!themeId()) return;
    try {
      setTheme(await adminResearchApi.preview(themeId()));
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
          title="Theme not found"
          description="This theme may have been deleted or the link is wrong."
        >
          <A href="/admin/research" class="siam-btn-primary no-underline">
            Back to research
          </A>
        </EmptyState>
      }
    >
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={theme()}>
        {(t) => (
          <div>
            <Title>{t().seo.title} — Preview</Title>
            <div
              class="mb-6 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted"
              role="status"
            >
              Preview — this theme is not necessarily published. Public visitors
              will not see this until you publish.
            </div>
            <ResearchThemeDetailView
              theme={t()}
              backHref={`/admin/research/${themeId()}`}
              backLabel="Back to editor"
            />
          </div>
        )}
      </Show>
    </Show>
  );
}
