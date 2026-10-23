import { adminClient } from "../../admin-client";
import type { Paginated } from "../../types";
import type {
  TimelineAdminDetail,
  TimelineAdminSummary,
  TimelineWriteBody,
} from "../../types/timeline.types";

export type ListTimelineParams = {
  q?: string;
  publishStatus?: string;
  kind?: string;
  kinds?: string[];
  page?: number;
  limit?: number;
  sort?: "startDateDesc" | "updatedAtDesc" | "titleAsc";
};

export const adminTimelineApi = {
  list: (params?: ListTimelineParams) =>
    adminClient.get<Paginated<TimelineAdminSummary>>("/timeline", { params }),

  get: (id: string) => adminClient.get<TimelineAdminDetail>(`/timeline/${id}`),

  create: (body: TimelineWriteBody) =>
    adminClient.post<TimelineAdminDetail>("/timeline", body),

  update: (id: string, body: Partial<TimelineWriteBody>) =>
    adminClient.patch<TimelineAdminDetail>(`/timeline/${id}`, body),
};
