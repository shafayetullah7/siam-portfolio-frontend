import { A, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import { adminMessagesApi } from "~/lib/api/endpoints/admin/messages.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type { ContactMessageAdmin } from "~/lib/api/types/contact.types";
import MessageDeleteDialog from "./MessageDeleteDialog";
import MessageStatusBadge from "./MessageStatusBadge";

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function mailtoHref(message: ContactMessageAdmin): string {
  const subject = message.category
    ? `Re: ${message.category}`
    : "Re: your message";
  return `mailto:${encodeURIComponent(message.senderEmail)}?subject=${encodeURIComponent(subject)}`;
}

export type AdminMessageDetailViewProps = {
  message: ContactMessageAdmin;
  onUpdated: (message: ContactMessageAdmin) => void;
};

export default function AdminMessageDetailView(props: AdminMessageDetailViewProps) {
  const navigate = useNavigate();
  const [notes, setNotes] = createSignal(props.message.adminNotes ?? "");
  const [savingNotes, setSavingNotes] = createSignal(false);
  const [notesError, setNotesError] = createSignal<string | null>(null);
  const [actionError, setActionError] = createSignal<string | null>(null);
  const [busy, setBusy] = createSignal(false);
  const [deleteOpen, setDeleteOpen] = createSignal(false);
  const [deleteError, setDeleteError] = createSignal<string | null>(null);
  const [deleting, setDeleting] = createSignal(false);

  createEffect(() => {
    setNotes(props.message.adminNotes ?? "");
  });

  async function patch(body: Parameters<typeof adminMessagesApi.update>[1]) {
    setActionError(null);
    setBusy(true);
    try {
      const updated = await adminMessagesApi.update(props.message.id, body);
      props.onUpdated(updated);
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function saveNotes(e: Event) {
    e.preventDefault();
    setNotesError(null);
    setSavingNotes(true);
    try {
      const updated = await adminMessagesApi.update(props.message.id, {
        adminNotes: notes().trim() || null,
      });
      props.onUpdated(updated);
    } catch (error) {
      setNotesError(getApiErrorMessage(error));
    } finally {
      setSavingNotes(false);
    }
  }

  async function confirmDelete() {
    setDeleteError(null);
    setDeleting(true);
    try {
      await adminMessagesApi.delete(props.message.id);
      setDeleteOpen(false);
      navigate("/admin/messages");
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  const m = () => props.message;

  return (
    <div>
      <p class="mb-4">
        <A href="/admin/messages" class="text-link text-sm no-underline">
          ← Back to messages
        </A>
      </p>

      <AdminPageHeader
        title={m().senderName}
        description={`Received ${formatWhen(m().submittedAt)}`}
      >
        <div class="flex flex-wrap items-center gap-2">
          <MessageStatusBadge status={m().status} />
          <Show when={!m().isRead}>
            <span class="text-xs font-medium text-primary">Unread</span>
          </Show>
          <a href={mailtoHref(m())} class="siam-btn-secondary no-underline">
            Reply by email
          </a>
        </div>
      </AdminPageHeader>

      <div class="mt-4">
        <FormErrorAlert message={actionError()} />
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <Show
          when={m().isRead}
          fallback={
            <button
              type="button"
              class="siam-btn-secondary text-sm"
              disabled={busy()}
              onClick={() => patch({ isRead: true })}
            >
              Mark read
            </button>
          }
        >
          <button
            type="button"
            class="siam-btn-secondary text-sm"
            disabled={busy()}
            onClick={() => patch({ isRead: false })}
          >
            Mark unread
          </button>
        </Show>
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          disabled={busy() || m().status === "replied"}
          onClick={() => patch({ status: "replied" })}
        >
          Mark replied
        </button>
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          disabled={busy() || m().status === "archived"}
          onClick={() => patch({ status: "archived" })}
        >
          Archive
        </button>
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          disabled={busy() || m().status === "spam"}
          onClick={() => patch({ status: "spam" })}
        >
          Mark spam
        </button>
        <button
          type="button"
          class="text-sm text-error hover:underline"
          onClick={() => setDeleteOpen(true)}
        >
          Delete
        </button>
      </div>

      <section class="mt-8 space-y-4 rounded-lg border border-border bg-surface p-4">
        <dl class="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-ink-muted">Email</dt>
            <dd class="text-ink">{m().senderEmail}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">Category</dt>
            <dd class="text-ink">{m().category ?? "—"}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">Affiliation</dt>
            <dd class="text-ink">{m().affiliation ?? "—"}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">Consent</dt>
            <dd class="text-ink">
              {m().consentGiven ? "Yes" : "No"}
              {m().consentTextVersion
                ? ` (${m().consentTextVersion})`
                : ""}
            </dd>
          </div>
        </dl>
        <div>
          <h2 class="text-sm font-medium text-ink-muted">Message</h2>
          <p class="mt-2 whitespace-pre-wrap text-ink">{m().body}</p>
        </div>
        <Show when={m().metadata?.ip || m().metadata?.userAgent}>
          <details class="text-sm text-ink-muted">
            <summary class="cursor-pointer font-medium text-ink">
              Submission metadata
            </summary>
            <ul class="mt-2 list-inside list-disc space-y-1">
              <Show when={m().metadata?.ip}>
                <li>IP: {m().metadata!.ip}</li>
              </Show>
              <Show when={m().metadata?.userAgent}>
                <li>User agent: {m().metadata!.userAgent}</li>
              </Show>
            </ul>
          </details>
        </Show>
      </section>

      <form class="mt-8 space-y-3" onSubmit={saveNotes}>
        <label class="flex flex-col gap-1 text-sm text-ink-muted">
          Private admin notes
          <textarea
            class="siam-input min-h-[120px] text-ink"
            value={notes()}
            onInput={(e) => setNotes(e.currentTarget.value)}
          />
        </label>
        <FormErrorAlert message={notesError()} />
        <button type="submit" class="siam-btn-primary" disabled={savingNotes()}>
          {savingNotes() ? "Saving…" : "Save notes"}
        </button>
      </form>

      <MessageDeleteDialog
        open={deleteOpen()}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
        busy={deleting()}
        error={deleteError()}
      />
    </div>
  );
}
