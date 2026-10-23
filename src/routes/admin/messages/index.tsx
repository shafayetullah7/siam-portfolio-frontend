import { useNavigate, useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import MessageStatusBadge from "~/components/admin/messages/MessageStatusBadge";
import EmptyState from "~/components/EmptyState";
import FormErrorAlert from "~/components/forms/FormErrorAlert";
import ResourceRequest from "~/components/ResourceRequest";
import { adminMessagesApi } from "~/lib/api/endpoints/admin/messages.api";
import { getApiErrorMessage } from "~/lib/api/errors";
import type { ContactMessageListItem } from "~/lib/api/types/contact.types";
import {
  applyMessageListFilters,
  messageListFolder,
  messageListSearchParamsToApi,
  parseMessageListSearchParams,
  setMessageListFolder,
  setMessageListPage,
  type MessageListFolder,
} from "~/lib/messages/message-list-search-params";
import { ChevronRight } from "~/icons";

function formatSubmitted(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function emptyCopy(folder: MessageListFolder): {
  title: string;
  description: string;
} {
  if (folder === "spam") {
    return {
      title: "No spam",
      description: "Messages marked as spam appear here.",
    };
  }
  if (folder === "archived") {
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

function isReadSelectValue(isRead?: "true" | "false"): string {
  if (isRead === "true") return "read";
  if (isRead === "false") return "unread";
  return "";
}

export default function AdminMessagesList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = () =>
    parseMessageListSearchParams(searchParams as Record<string, string>);
  const folder = () => messageListFolder(parsed());

  const [draftQ, setDraftQ] = createSignal("");
  const [draftCategory, setDraftCategory] = createSignal("");
  const [draftFrom, setDraftFrom] = createSignal("");
  const [draftTo, setDraftTo] = createSignal("");
  const [draftIsRead, setDraftIsRead] = createSignal("");
  const [selected, setSelected] = createSignal<Set<string>>(new Set());
  const [bulkError, setBulkError] = createSignal<string | null>(null);
  const [bulkBusy, setBulkBusy] = createSignal(false);

  createEffect(() => {
    const p = parsed();
    setDraftQ(p.q ?? "");
    setDraftCategory(p.category ?? "");
    setDraftFrom(p.from ?? "");
    setDraftTo(p.to ?? "");
    setDraftIsRead(isReadSelectValue(p.isRead));
    setSelected(new Set());
  });

  const messagesResource = createResource(
    () => messageListSearchParamsToApi(parsed()),
    (params) => adminMessagesApi.list(params),
  );

  function applyFilters(e: Event) {
    e.preventDefault();
    applyMessageListFilters(setSearchParams, {
      q: draftQ(),
      category: draftCategory(),
      from: draftFrom(),
      to: draftTo(),
      isRead: draftIsRead(),
    });
  }

  const tabClass = (active: boolean) =>
    [
      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
      active
        ? "bg-secondary-container text-on-secondary-container"
        : "text-ink-muted hover:bg-surface-container-lowest",
    ].join(" ");

  const bulkEnabled = () => folder() !== "spam";

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllOnPage(items: ContactMessageListItem[], checked: boolean) {
    if (!checked) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(items.map((row) => row.id)));
  }

  async function runBulk(
    patch: { isRead?: boolean; status?: "archived" },
  ) {
    const ids = [...selected()];
    if (ids.length === 0) return;
    setBulkError(null);
    setBulkBusy(true);
    try {
      await adminMessagesApi.bulkUpdate({ ids, patch });
      setSelected(new Set());
      void messagesResource[1].refetch();
    } catch (error) {
      setBulkError(getApiErrorMessage(error));
    } finally {
      setBulkBusy(false);
    }
  }

  const tabs = (currentFolder: MessageListFolder) => (
    <div class="mt-6 flex flex-wrap gap-2">
      <button
        type="button"
        class={tabClass(currentFolder === "inbox")}
        onClick={() => setMessageListFolder(setSearchParams, "inbox")}
      >
        Inbox
      </button>
      <button
        type="button"
        class={tabClass(currentFolder === "spam")}
        onClick={() => setMessageListFolder(setSearchParams, "spam")}
      >
        Spam
      </button>
      <button
        type="button"
        class={tabClass(currentFolder === "archived")}
        onClick={() => setMessageListFolder(setSearchParams, "archived")}
      >
        Archived
      </button>
    </div>
  );

  const filterForm = (
    <form
      class="mt-6 flex flex-wrap items-end gap-3"
      onSubmit={applyFilters}
    >
      <label class="flex flex-col gap-1 text-sm text-ink-muted">
        Search
        <input
          type="search"
          class="siam-input min-w-[12rem] text-ink"
          placeholder="Name, email, or message"
          value={draftQ()}
          onInput={(e) => setDraftQ(e.currentTarget.value)}
        />
      </label>
      <label class="flex flex-col gap-1 text-sm text-ink-muted">
        Category
        <input
          type="text"
          class="siam-input min-w-[8rem] text-ink"
          value={draftCategory()}
          onInput={(e) => setDraftCategory(e.currentTarget.value)}
        />
      </label>
      <label class="flex flex-col gap-1 text-sm text-ink-muted">
        From
        <input
          type="date"
          class="siam-input text-ink"
          value={draftFrom()}
          onInput={(e) => setDraftFrom(e.currentTarget.value)}
        />
      </label>
      <label class="flex flex-col gap-1 text-sm text-ink-muted">
        To
        <input
          type="date"
          class="siam-input text-ink"
          value={draftTo()}
          onInput={(e) => setDraftTo(e.currentTarget.value)}
        />
      </label>
      <label class="flex flex-col gap-1 text-sm text-ink-muted">
        Read state
        <select
          class="siam-input text-ink"
          value={draftIsRead()}
          onChange={(e) => setDraftIsRead(e.currentTarget.value)}
        >
          <option value="">All</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </label>
      <button type="submit" class="siam-btn-secondary">Apply</button>
    </form>
  );

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
          {tabs(folder())}
          {filterForm}
          <EmptyState
            variant="list"
            title={emptyCopy(folder()).title}
            description={emptyCopy(folder()).description}
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

          {tabs(folder())}
          {filterForm}

          <Show when={bulkEnabled() && selected().size > 0}>
            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="text-sm text-ink-muted">
                {selected().size} selected
              </span>
              <button
                type="button"
                class="siam-btn-secondary text-sm"
                disabled={bulkBusy()}
                onClick={() => runBulk({ isRead: true })}
              >
                Mark read
              </button>
              <button
                type="button"
                class="siam-btn-secondary text-sm"
                disabled={bulkBusy()}
                onClick={() => runBulk({ status: "archived" })}
              >
                Archive
              </button>
            </div>
          </Show>
          <FormErrorAlert message={bulkError()} />

          <div class="mt-6 overflow-x-auto">
            <table class="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-border text-ink-muted">
                  <Show when={bulkEnabled()}>
                    <th class="w-10 py-2 pr-2 font-medium">
                      <input
                        type="checkbox"
                        aria-label="Select all on page"
                        checked={
                          data.items.length > 0 &&
                          data.items.every((row) => selected().has(row.id))
                        }
                        onChange={(e) =>
                          toggleAllOnPage(data.items, e.currentTarget.checked)
                        }
                      />
                    </th>
                  </Show>
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
                      class="border-b border-border transition-colors hover:bg-surface-container-lowest"
                    >
                      <Show when={bulkEnabled()}>
                        <td class="py-3 pr-2">
                          <input
                            type="checkbox"
                            aria-label={`Select message from ${row.senderName}`}
                            checked={selected().has(row.id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              toggleRow(row.id, e.currentTarget.checked)
                            }
                          />
                        </td>
                      </Show>
                      <td
                        class="cursor-pointer py-3 pr-4 font-medium text-ink"
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
                      <td
                        class="cursor-pointer py-3 pr-4 text-ink-muted"
                        onClick={() => navigate(`/admin/messages/${row.id}`)}
                      >
                        {row.senderEmail}
                      </td>
                      <td
                        class="cursor-pointer py-3 pr-4 text-ink-muted"
                        onClick={() => navigate(`/admin/messages/${row.id}`)}
                      >
                        {row.category ?? "—"}
                      </td>
                      <td
                        class="cursor-pointer py-3 pr-4 text-ink-muted"
                        onClick={() => navigate(`/admin/messages/${row.id}`)}
                      >
                        {formatSubmitted(row.submittedAt)}
                      </td>
                      <td
                        class="cursor-pointer py-3 pr-4"
                        onClick={() => navigate(`/admin/messages/${row.id}`)}
                      >
                        <MessageStatusBadge status={row.status} />
                      </td>
                      <td class="py-3 text-ink-muted">
                        <button
                          type="button"
                          class="text-ink-muted"
                          aria-label={`View message from ${row.senderName}`}
                          onClick={() => navigate(`/admin/messages/${row.id}`)}
                        >
                          <ChevronRight class="size-4" aria-hidden="true" />
                        </button>
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
                  onClick={() =>
                    setMessageListPage(setSearchParams, data.meta.page - 1)
                  }
                >
                  Previous
                </button>
                <button
                  type="button"
                  class="siam-btn-secondary"
                  disabled={data.meta.page >= data.meta.totalPages}
                  onClick={() =>
                    setMessageListPage(setSearchParams, data.meta.page + 1)
                  }
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
