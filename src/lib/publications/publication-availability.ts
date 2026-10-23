import type { PublicationAvailabilityLabel } from "~/lib/api/types/publication.types";

export function publicationAvailabilityLabel(
  value: PublicationAvailabilityLabel,
): string {
  switch (value) {
    case "open_access":
      return "Open access";
    case "publisher_link":
      return "Publisher link";
    case "no_pdf":
      return "No PDF on site";
  }
}
