import ResearchFocusCard from "~/components/landing/ResearchFocusCard";
import type { HomeResearchFocusItem } from "~/content";
import { parseTagsFromInput } from "~/lib/forms/schemas/admin-research-theme.schema";
import type { ResearchThemeCreateDraft } from "./createWizard.types";

function draftToPreviewItem(draft: ResearchThemeCreateDraft): HomeResearchFocusItem {
  const slug = draft.slug.trim();
  const tags = parseTagsFromInput(draft.tagsInput);
  return {
    title: draft.title.trim() || "Untitled theme",
    description:
      draft.summary.trim() || "Summary appears on the research hub card.",
    href: slug ? `/research/${slug}` : "#",
    ...(tags.length > 0 ? { tags } : {}),
    coverUrl: draft.coverPreviewUrl,
    coverAlt: draft.coverPreviewAlt,
  };
}

export type ResearchThemeCardPreviewProps = {
  draft: ResearchThemeCreateDraft;
};

export default function ResearchThemeCardPreview(
  props: ResearchThemeCardPreviewProps,
) {
  const item = () => draftToPreviewItem(props.draft);
  return (
    <div class="min-w-0" aria-label="Hub card preview">
      <p class="siam-eyebrow mb-3 text-secondary">Hub card preview</p>
      <div class="pointer-events-none max-w-md [&_h3]:break-words [&_p]:break-words">
        <ResearchFocusCard item={item()} themeIndex={1} />
      </div>
    </div>
  );
}
