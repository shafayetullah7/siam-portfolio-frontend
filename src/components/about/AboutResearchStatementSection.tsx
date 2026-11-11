import ArticleMarkdownBody from "~/components/writing/ArticleMarkdownBody";
import type { AboutPageViewModel } from "~/lib/api/public/mapPublicAboutToViewModel";

export type AboutResearchStatementSectionProps = {
  model: AboutPageViewModel;
};

export default function AboutResearchStatementSection(
  props: AboutResearchStatementSectionProps,
) {
  const statement = () => props.model.researchStatement ?? "";
  return (
    <section
      class="mt-12 border-t border-border pt-10"
      aria-labelledby="about-research-statement-heading"
    >
      <h2
        id="about-research-statement-heading"
        class="siam-headline-md text-brand-deep"
      >
        Research statement
      </h2>
      <div class="siam-prose mt-4 max-w-prose">
        <ArticleMarkdownBody markdown={statement()} />
      </div>
    </section>
  );
}
