import { adminClient } from "../../admin-client";
import type { MediaAdmin } from "../../types/admin.types";

function uploadWithPath(path: string, file: File): Promise<MediaAdmin> {
  const form = new FormData();
  form.append("file", file);
  return adminClient.post<MediaAdmin>(path, form);
}

export const adminMediaApi = {
  list: () => adminClient.get<MediaAdmin[]>("/media"),

  /** General upload — images or PDF, max 10MB (server enforced). */
  upload: (file: File) => uploadWithPath("/media/upload", file),

  /** Image-only upload — max 3MB (server enforced). */
  uploadImage: (file: File) => uploadWithPath("/media/upload/image", file),
};
