import type { HomePublicationHighlight } from "~/content/home.types";
import type { PublicationPublicCard } from "~/lib/api/types/publication.types";

export function publicationPublicCardToHomeItem(
  card: PublicationPublicCard,
): HomePublicationHighlight {
  return {
    title: card.title,
    authorsShort: card.authorsShort,
    year: card.year,
    venue: card.venue,
    significance: card.significance ?? "",
    href: card.href,
    featured: card.featured,
    publicationType: card.publicationType,
    availability: card.availability,
  };
}
