import {
  listResearchThemes,
  researchThemeToHomeItem,
} from "~/content";
import ResearchFocusGrid from "~/components/landing/ResearchFocusGrid";

export default function ResearchThemeList() {
  const items = listResearchThemes().map(researchThemeToHomeItem);
  return <ResearchFocusGrid items={items} />;
}
