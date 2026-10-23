import { adminClient } from "../../admin-client";
import type { Paginated } from "../../types";
import type {
  WritingAdminDetail,
  WritingAdminSummary,
  WritingWriteBody,
} from "../../types/writing.types";

export type ListWritingParams = {
  q?: string;
  publishStatus?: string;
  tag?: string;
  seriesId?: string;
  page?: number;
  limit?: number;
  sort?: "updatedAtDesc" | "titleAsc" | "publishedAtDesc";
};

export const adminWritingApi = {
  list: (params?: ListWritingParams) =>
    adminClient.get<Paginated<WritingAdminSummary>>("/writing", { params }),

  get: (id: string) =>
    adminClient.get<WritingAdminDetail>(`/writing/${id}`),

  create: (body: WritingWriteBody) =>
    adminClient.post<WritingAdminDetail>("/writing", body),

  update: (id: string, body: Partial<WritingWriteBody>) =>
    adminClient.patch<WritingAdminDetail>(`/writing/${id}`, body),
};
