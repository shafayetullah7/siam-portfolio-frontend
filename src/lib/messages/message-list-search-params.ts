import type { ListMessagesParams } from "~/lib/api/endpoints/admin/messages.api";
import type { ContactInquiryStatus } from "~/lib/api/types/contact.types";

export type MessageListFolder = "inbox" | "spam" | "archived";

const INBOX_STATUS_FILTERS: ContactInquiryStatus[] = [
  "new",
  "read",
  "replied",
];

export type MessageListSearchParams = {
  folder?: MessageListFolder;
  status?: ContactInquiryStatus;
  isRead?: "true" | "false";
  category?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: string;
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseFolder(raw: string | undefined): MessageListFolder {
  if (raw === "spam" || raw === "archived") return raw;
  return "inbox";
}

function parseInboxStatus(
  raw: string | undefined,
  folder: MessageListFolder,
): ContactInquiryStatus | undefined {
  if (folder === "spam") return "spam";
  if (folder === "archived") return "archived";
  if (!raw) return undefined;
  if (INBOX_STATUS_FILTERS.includes(raw as ContactInquiryStatus)) {
    return raw as ContactInquiryStatus;
  }
  if (raw === "new" || raw === "read" || raw === "replied") {
    return raw;
  }
  return undefined;
}

export function parseMessageListSearchParams(
  searchParams: SearchParamsRecord,
): MessageListSearchParams {
  const folder = parseFolder(first(searchParams.folder)?.trim());
  const statusRaw = first(searchParams.status)?.trim();
  const status = parseInboxStatus(statusRaw, folder);
  const isReadRaw = first(searchParams.isRead)?.trim();
  const isRead =
    isReadRaw === "true" || isReadRaw === "false" ? isReadRaw : undefined;
  const category = first(searchParams.category)?.trim();
  const q = first(searchParams.q)?.trim();
  const from = first(searchParams.from)?.trim();
  const to = first(searchParams.to)?.trim();
  const page = first(searchParams.page)?.trim();

  return {
    folder,
    ...(status ? { status } : {}),
    ...(isRead ? { isRead } : {}),
    ...(category ? { category } : {}),
    ...(q ? { q } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
    ...(page ? { page } : {}),
  };
}

export function messageListSearchParamsToApi(
  params: MessageListSearchParams,
): ListMessagesParams {
  const folder = params.folder ?? "inbox";
  const page = params.page ? Number.parseInt(params.page, 10) : undefined;
  let status: ListMessagesParams["status"];
  if (folder === "spam") {
    status = "spam";
  } else if (folder === "archived") {
    status = "archived";
  } else if (params.status) {
    status = params.status;
  }

  return {
    ...(status ? { status } : {}),
    ...(params.isRead === "true"
      ? { isRead: true }
      : params.isRead === "false"
        ? { isRead: false }
        : {}),
    ...(params.category ? { category: params.category } : {}),
    ...(params.q ? { q: params.q } : {}),
    ...(params.from ? { from: params.from } : {}),
    ...(params.to ? { to: params.to } : {}),
    ...(page && page > 0 ? { page } : {}),
    limit: 24,
  };
}

export function messageListFolder(
  params: MessageListSearchParams,
): MessageListFolder {
  return params.folder ?? "inbox";
}

type SetSearchParams = (
  params: Record<string, string | undefined | null>,
  options?: { replace?: boolean },
) => void;

export function setMessageListSearchParams(
  setSearchParams: SetSearchParams,
  patch: Partial<MessageListSearchParams> & { folder?: MessageListFolder | null },
  options?: { replace?: boolean },
) {
  const next: Record<string, string | undefined | null> = {};
  if ("folder" in patch) {
    next.folder = patch.folder === "inbox" || !patch.folder ? null : patch.folder;
  }
  if ("status" in patch) next.status = patch.status ?? null;
  if ("isRead" in patch) next.isRead = patch.isRead ?? null;
  if ("category" in patch) next.category = patch.category ?? null;
  if ("q" in patch) next.q = patch.q ?? null;
  if ("from" in patch) next.from = patch.from ?? null;
  if ("to" in patch) next.to = patch.to ?? null;
  if ("page" in patch) next.page = patch.page ?? null;
  setSearchParams(next, options);
}

export function setMessageListFolder(
  setSearchParams: SetSearchParams,
  folder: MessageListFolder,
) {
  setMessageListSearchParams(
    setSearchParams,
    {
      folder,
      page: null,
      status: folder === "inbox" ? undefined : null,
    },
    { replace: false },
  );
}

export function setMessageListPage(
  setSearchParams: SetSearchParams,
  page: number,
) {
  setSearchParams({
    page: page <= 1 ? null : String(page),
  });
}

export function applyMessageListFilters(
  setSearchParams: SetSearchParams,
  patch: {
    q?: string;
    category?: string;
    from?: string;
    to?: string;
    isRead?: string;
  },
) {
  setMessageListSearchParams(setSearchParams, {
    q: patch.q?.trim() || null,
    category: patch.category?.trim() || null,
    from: patch.from?.trim() || null,
    to: patch.to?.trim() || null,
    isRead:
      patch.isRead === "read"
        ? "true"
        : patch.isRead === "unread"
          ? "false"
          : null,
    page: null,
  });
}
