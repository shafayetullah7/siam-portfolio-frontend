import type {
  TimelineImageRole,
  TimelineMediaLinkAdmin,
  TimelineReplaceMediaItem,
} from "~/lib/api/types/timeline.types";

export type TimelineGalleryRow = {
  mediaId: string;
  sortOrder: number;
  caption: string | null;
  imageRole: TimelineImageRole | null;
  url?: string;
  alt?: string | null;
};

export function galleryRowsFromMediaLinks(
  links: TimelineMediaLinkAdmin[],
): TimelineGalleryRow[] {
  return [...links]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((link) => ({
      mediaId: link.mediaId,
      sortOrder: link.sortOrder,
      caption: link.caption,
      imageRole: link.imageRole,
      url: link.url,
      alt: link.alt,
    }));
}

export function reindexGalleryRows(rows: TimelineGalleryRow[]): TimelineGalleryRow[] {
  return rows.map((row, index) => ({ ...row, sortOrder: index }));
}

export function galleryRowsToReplaceItems(
  rows: TimelineGalleryRow[],
): TimelineReplaceMediaItem[] {
  return reindexGalleryRows(rows).map((row) => ({
    mediaId: row.mediaId,
    sortOrder: row.sortOrder,
    caption: row.caption,
    imageRole: row.imageRole,
  }));
}
