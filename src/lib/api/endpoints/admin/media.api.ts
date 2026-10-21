import { adminClient } from "../../admin-client";
import { getApiErrorMessage, isApiError } from "../../errors";
import type { MediaAdmin, MediaListResponse } from "../../types/admin.types";

function uploadWithPath(path: string, file: File): Promise<MediaAdmin> {
  const form = new FormData();
  form.append("file", file);
  return adminClient.post<MediaAdmin>(path, form);
}

/** User-facing message for media admin actions (e.g. delete blocked when in use). */
export function getMediaAdminErrorMessage(error: unknown): string {
  if (isApiError(error) && error.status === 403 && error.message) {
    return error.message;
  }
  return getApiErrorMessage(error);
}

export const adminMediaApi = {
  list: (params?: {
    q?: string;
    mime?: string;
    imagesOnly?: boolean;
    page?: number;
    limit?: number;
  }) => adminClient.get<MediaListResponse>("/media", { params }),

  get: (id: string) => adminClient.get<MediaAdmin>(`/media/${id}`),

  update: (
    id: string,
    body: Pick<MediaAdmin, "alt" | "caption" | "license">,
  ) => adminClient.patch<MediaAdmin>(`/media/${id}`, body),

  delete: (id: string) => adminClient.delete<void>(`/media/${id}`),

  /** General upload — images or PDF, max 10MB (server enforced). */
  upload: (file: File) => uploadWithPath("/media/upload", file),

  /** Image-only upload — max 3MB (server enforced). */
  uploadImage: (file: File) => uploadWithPath("/media/upload/image", file),
};
