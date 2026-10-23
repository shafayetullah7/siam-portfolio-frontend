import { A, useParams } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import TimelinePublicDetailView from "~/components/timeline/TimelinePublicDetailView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminTimelineApi } from "~/lib/api/endpoints/admin/timeline.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { TimelinePublicDetail } from "~/lib/api/types/timeline.types";

export default function AdminTimelineEntryPreview() {
  const params = useParams();
  const entryId = () => params.id ?? "";
  const [detail, setDetail] = createSignal<TimelinePublicDetail | null>(null);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = entryId();
    if (!id) return;
    try {
      setDetail(await adminTimelineApi.preview(id));
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
          title="Entry not found"
          description="This timeline entry may have been deleted or the link is wrong."
        >
          <A href="/admin/achievements" class="siam-btn-primary no-underline">
            Back to achievements
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
              Preview — this entry is not necessarily published. Public visitors
              will not see it until you publish.
            </div>
            <TimelinePublicDetailView
              detail={d()}
              backHref={`/admin/achievements/${entryId()}`}
              backLabel="Back to entry"
            />
          </div>
        )}
      </Show>
    </Show>
  );
}
