import { A, useNavigate, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import AdminTimelineEntryView from "~/components/admin/timeline/AdminTimelineEntryView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminTimelineApi } from "~/lib/api/endpoints/admin/timeline.api";
import type { TimelineAdminDetail } from "~/lib/api/types/timeline.types";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";

export default function AdminAchievementsViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const entryId = () => params.id ?? "";

  const [entry, setEntry] = createSignal<TimelineAdminDetail | null>(null);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = entryId();
    if (id === "new") {
      navigate("/admin/achievements/new", { replace: true });
      return;
    }
    if (!id) return;
    try {
      setEntry(await adminTimelineApi.get(id));
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
      <Title>{entry()?.title ?? "Timeline entry"} — SIAM Admin</Title>
      <Show when={loadError()}>
        <FormErrorAlert message={loadError()} />
      </Show>
      <Show when={entry()}>
        {(row) => (
          <AdminTimelineEntryView
            entry={row()}
            onEntryUpdated={setEntry}
          />
        )}
      </Show>
    </Show>
  );
}
