export const MEDIA_LIBRARY_PAGE_LIMIT = 24;

export const MIME_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All types" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/gif", label: "GIF" },
  { value: "application/pdf", label: "PDF" },
];

export const IMAGE_MIME_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All images" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/gif", label: "GIF" },
];
