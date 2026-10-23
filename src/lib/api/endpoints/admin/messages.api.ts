import { adminClient } from "../../admin-client";
import type { Paginated } from "../../types";
import type {
  ContactInquiryStatus,
  ContactMessageAdmin,
  ContactMessageListItem,
} from "../../types/contact.types";

export type ListMessagesParams = {
  status?: ContactInquiryStatus;
  isRead?: boolean;
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
  excludeSpam?: boolean;
};

export type UpdateMessageBody = {
  status?: ContactInquiryStatus;
  isRead?: boolean;
  adminNotes?: string | null;
};

export const adminMessagesApi = {
  list: (params?: ListMessagesParams) =>
    adminClient.get<Paginated<ContactMessageListItem>>("/messages", { params }),

  get: (id: string) => adminClient.get<ContactMessageAdmin>(`/messages/${id}`),

  update: (id: string, body: UpdateMessageBody) =>
    adminClient.patch<ContactMessageAdmin>(`/messages/${id}`, body),

  delete: (id: string) => adminClient.delete<null>(`/messages/${id}`),
};
