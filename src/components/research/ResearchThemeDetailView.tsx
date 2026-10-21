import DetailStubLayout from "~/components/catalog/DetailStubLayout";
import type { ResearchThemeDetailPublic } from "~/lib/api/types/research.types";
import ResearchThemeDetailContent from "./ResearchThemeDetailContent";

export type ResearchThemeDetailViewProps = {
  theme: ResearchThemeDetailPublic;
  backHref: string;
  backLabel: string;
};

export default function ResearchThemeDetailView(props: ResearchThemeDetailViewProps) {
  const theme = () => props.theme;
  const tags = () => theme().tags;
  const themeNav = () => {
    const t = theme();
    const prev = t.prevSlug
      ? { href: `/research/${t.prevSlug}`, label: "Previous theme" }
      : undefined;
    const next = t.nextSlug
      ? { href: `/research/${t.nextSlug}`, label: "Next theme" }
      : undefined;
    if (!prev && !next) return undefined;
    return { prev, next };
  };
  return (
    <DetailStubLayout
      title={theme().title}
      backHref={props.backHref}
      backLabel={props.backLabel}
      themeNav={themeNav()}
      relatedLinks={[
        { label: "Publications", href: "/publications" },
        { label: "Projects", href: "/projects" },
      ]}
      meta={
        <>
          <span class="capitalize">{theme().themeStatus}</span>
          {tags() && tags()!.length > 0 && (
            <span class="mt-2 block">{tags()!.join(" · ")}</span>
          )}
          {theme().updatedAt && (
            <span class="mt-2 block text-sm text-on-surface-variant">
              Last updated{" "}
              {new Date(theme().updatedAt!).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </>
      }
    >
      <ResearchThemeDetailContent theme={theme()} />
    </DetailStubLayout>
  );
}
