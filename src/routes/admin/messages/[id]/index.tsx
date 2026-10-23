import { A, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createSignal, onMount, Show } from "solid-js";
import AdminMessageDetailView from "~/components/admin/messages/AdminMessageDetailView";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import PageLoading from "~/components/PageLoading";
import { adminMessagesApi } from "~/lib/api/endpoints/admin/messages.api";
import { getApiErrorMessage, isApiError } from "~/lib/api/errors";
import type { ContactMessageAdmin } from "~/lib/api/types/contact.types";

export default function AdminMessageDetailPage() {
  const params = useParams();
  const messageId = () => params.id ?? "";

  const [message, setMessage] = createSignal<ContactMessageAdmin | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [notFound, setNotFound] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);

  onMount(async () => {
    const id = messageId();
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    try {
      setMessage(await adminMessagesApi.get(id));
    } catch (error) {
      if (isApiError(error) && error.status === 404) {
        setNotFound(true);
        return;
      }
      setLoadError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  });

  return (
    <Show when={!loading()} fallback={<PageLoading />}>
      <Show
        when={!notFound()}
        fallback={
          <EmptyState
            variant="list"
            title="Message not found"
            description="This message may have been deleted or the link is wrong."
          >
            <A href="/admin/messages" class="siam-btn-primary no-underline">
              Back to messages
            </A>
          </EmptyState>
        }
      >
        <Show when={loadError()}>
          <FormErrorAlert message={loadError()} />
        </Show>
        <Show when={message()}>
          <Title>{message()!.senderName} — Messages — SIAM Admin</Title>
          <AdminMessageDetailView
            message={message()!}
            onUpdated={(updated) => setMessage(updated)}
          />
        </Show>
      </Show>
    </Show>
  );
}
