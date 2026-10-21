import { adminMediaApi } from "~/lib/api/endpoints/admin/media.api";
import type { MediaAdmin } from "~/lib/api/types/admin.types";

const IMAGE_MIME_PREFIX = "image/";

export function isImageMime(mime: string | null | undefined): boolean {
  return Boolean(mime?.startsWith(IMAGE_MIME_PREFIX));
}

export async function uploadMediaFile(file: File): Promise<MediaAdmin> {
  if (file.type === "application/pdf") {
    return adminMediaApi.upload(file);
  }
  if (isImageMime(file.type)) {
    return adminMediaApi.uploadImage(file);
  }
  return adminMediaApi.upload(file);
}

export const MEDIA_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,application/pdf";

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export function formatMediaBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
