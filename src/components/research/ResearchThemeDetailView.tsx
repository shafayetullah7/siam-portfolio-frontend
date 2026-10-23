import DetailStubLayout from "~/components/catalog/DetailStubLayout";
import { formatDisplayDate } from "~/lib/utils/formatDisplayDate";
import type { ResearchThemeDetailPublic } from "~/lib/api/types/research.types";
import ResearchThemeDetailContent from "./ResearchThemeDetailContent";

export type ResearchThemeDetailViewProps = {
  theme: ResearchThemeDetailPublic;
  backHref: string;
  backLabel: string;
};

function buildMetaLines(theme: ResearchThemeDetailPublic): string[] {
  const lines: string[] = [theme.themeStatus];
  const tags = theme.tags;
  if (tags && tags.length > 0) {
    lines.push(tags.join(" · "));
  }
  if (theme.updatedAt) {
    lines.push(`Last updated ${formatDisplayDate(theme.updatedAt)}`);
  }
  return lines;
}

export default function ResearchThemeDetailView(props: ResearchThemeDetailViewProps) {
  const theme = () => props.theme;
  const metaLines = () => buildMetaLines(theme());

  return (
    <DetailStubLayout
      title={theme().title}
      backHref={props.backHref}
      backLabel={props.backLabel}
      metaLines={metaLines()}
      metaFirstLineClass="capitalize"
      detailSlugBase="/research"
      prevSlug={theme().prevSlug}
      nextSlug={theme().nextSlug}
      detailNavAriaLabel="Theme navigation"
      relatedLinks={[
        { label: "Publications", href: "/publications" },
        { label: "Projects", href: "/projects" },
      ]}
    >
      <ResearchThemeDetailContent theme={theme()} />
    </DetailStubLayout>
  );
}
