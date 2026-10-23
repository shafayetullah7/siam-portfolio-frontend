import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import MessageStatusBadge from "~/components/admin/messages/MessageStatusBadge";
import EmptyState from "~/components/EmptyState";
import ResourceRequest from "~/components/ResourceRequest";
import {
  adminMessagesApi,
  type ListMessagesParams,
} from "~/lib/api/endpoints/admin/messages.api";
import type { ContactMessageListItem } from "~/lib/api/types/contact.types";
import { ChevronRight } from "~/icons";

type InboxView = "inbox" | "spam" | "archived";

function formatSubmitted(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function viewToStatus(view: InboxView): ListMessagesParams["status"] | undefined {
  if (view === "spam") return "spam";
  if (view === "archived") return "archived";
  return undefined;
}

function emptyCopy(view: InboxView): { title: string; description: string } {
  if (view === "spam") {
    return {
      title: "No spam",
      description: "Messages marked as spam appear here.",
    };
  }
  if (view === "archived") {
    return {
      title: "No archived messages",
      description: "Archived inquiries are stored here for reference.",
    };
  }
  return {
    title: "No messages yet",
    description:
      "When visitors submit the contact form, inquiries will appear here.",
  };
}

export default function AdminMessagesList() {
  const navigate = useNavigate();
  const [view, setView] = createSignal<InboxView>("inbox");
  const [page, setPage] = createSignal(1);
  const [q, setQ] = createSignal("");
  const [appliedQ, setAppliedQ] = createSignal("");
  const [isReadFilter, setIsReadFilter] = createSignal("");

  const messagesResource = createResource(
    () => ({
      status: viewToStatus(view()),
      isRead:
        isReadFilter() === "read"
          ? true
          : isReadFilter() === "unread"
            ? false
            : undefined,
      q: appliedQ() || undefined,
      page: page(),
      limit: 24,
    }),
    (params) => adminMessagesApi.list(params),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    setAppliedQ(q().trim());
    setPage(1);
  }

  function switchView(next: InboxView) {
    setView(next);
    setPage(1);
  }

  const tabClass = (active: boolean) =>
    [
      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
      active
        ? "bg-secondary-container text-on-secondary-container"
        : "text-ink-muted hover:bg-surface-container-lowest",
    ].join(" ");

  return (
    <ResourceRequest
      resource={messagesResource}
      emptyWhen={(data) => data.items.length === 0}
      emptyFallback={
        <div>
          <Title>Messages — SIAM Admin</Title>
          <AdminPageHeader
            title="Messages"
            description="Contact inbox (A11). Triage inquiries from the public contact form."
          />
          <div class="mt-6 flex flex-wrap gap-2">
            <button type="button" class={tabClass(view() === "inbox")} onClick={() => switchView("inbox")}>
              Inbox
            </button>
            <button type="button" class={tabClass(view() === "spam")} onClick={() => switchView("spam")}>
              Spam
            </button>
            <button type="button" class={tabClass(view() === "archived")} onClick={() => switchView("archived")}>
              Archived
            </button>
          </div>
          <EmptyState
            variant="list"
            title={emptyCopy(view()).title}
            description={emptyCopy(view()).description}
          />
        </div>
      }
    >
      {(data) => (
        <div>
          <Title>Messages — SIAM Admin</Title>
          <AdminPageHeader
            title="Messages"
            description="Contact inbox (A11). Triage inquiries from the public contact form."
          />

          <div class="mt-6 flex flex-wrap gap-2">
            <button type="button" class={tabClass(view() === "inbox")} onClick={() => switchView("inbox")}>
              Inbox
            </button>
            <button type="button" class={tabClass(view() === "spam")} onClick={() => switchView("spam")}>
              Spam
            </button>
            <button type="button" class={tabClass(view() === "archived")} onClick={() => switchView("archived")}>
              Archived
            </button>
          </div>

          <form
            class="mt-6 flex flex-wrap items-end gap-3"
            onSubmit={applyFilters}
          >
            <label class="flex flex-col gap-1 text-sm text-ink-muted">
              Search
              <input
                type="search"
                class="siam-input min-w-[12rem] text-ink"
                placeholder="Name or email"
                value={q()}
                onInput={(e) => setQ(e.currentTarget.value)}
              />
            </label>
            <label class="flex flex-col gap-1 text-sm text-ink-muted">
              Read state
              <select
                class="siam-input text-ink"
                value={isReadFilter()}
                onChange={(e) => {
                  setIsReadFilter(e.currentTarget.value);
                  setPage(1);
                }}
              >
                <option value="">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </label>
            <button type="submit" class="siam-btn-secondary">Apply</button>
          </form>

          <div class="mt-6 overflow-x-auto">
            <table class="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-border text-ink-muted">
                  <th class="py-2 pr-4 font-medium">Sender</th>
                  <th class="py-2 pr-4 font-medium">Email</th>
                  <th class="py-2 pr-4 font-medium">Category</th>
                  <th class="py-2 pr-4 font-medium">Received</th>
                  <th class="py-2 pr-4 font-medium">Status</th>
                  <th class="w-10 py-2 font-medium" aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                <For each={data.items}>
                  {(row: ContactMessageListItem) => (
                    <tr
                      class="cursor-pointer border-b border-border transition-colors hover:bg-surface-container-lowest"
                      tabIndex={0}
                      role="link"
                      aria-label={`View message from ${row.senderName}`}
                      onClick={() => navigate(`/admin/messages/${row.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          navigate(`/admin/messages/${row.id}`);
                        }
                      }}
                    >
                      <td class="py-3 pr-4 font-medium text-ink">
                        <span class="inline-flex items-center gap-2">
                          <Show when={!row.isRead}>
                            <span
                              class="size-2 shrink-0 rounded-full bg-primary"
                              aria-label="Unread"
                            />
                          </Show>
                          {row.senderName}
                        </span>
                      </td>
                      <td class="py-3 pr-4 text-ink-muted">{row.senderEmail}</td>
                      <td class="py-3 pr-4 text-ink-muted">
                        {row.category ?? "—"}
                      </td>
                      <td class="py-3 pr-4 text-ink-muted">
                        {formatSubmitted(row.submittedAt)}
                      </td>
                      <td class="py-3 pr-4">
                        <MessageStatusBadge status={row.status} />
                      </td>
                      <td class="py-3 text-ink-muted">
                        <ChevronRight class="size-4" aria-hidden="true" />
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <Show when={data.meta.totalPages > 1}>
            <div class="mt-6 flex items-center justify-between gap-4 text-sm text-ink-muted">
              <span>
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total}{" "}
                total)
              </span>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="siam-btn-secondary"
                  disabled={data.meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  class="siam-btn-secondary"
                  disabled={data.meta.page >= data.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </Show>
        </div>
      )}
    </ResourceRequest>
  );
}
