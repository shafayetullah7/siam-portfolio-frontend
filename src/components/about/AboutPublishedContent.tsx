import { Show } from "solid-js";
import type { AboutPageViewModel } from "~/lib/api/public/mapPublicAboutToViewModel";
import AboutAffiliationSection from "./AboutAffiliationSection";
import AboutCollaborationSection from "./AboutCollaborationSection";
import AboutExpertiseSection from "./AboutExpertiseSection";
import AboutIntroSection from "./AboutIntroSection";
import AboutResearchStatementSection from "./AboutResearchStatementSection";
import AboutScholarlySection from "./AboutScholarlySection";

export type AboutPublishedContentProps = {
  model: AboutPageViewModel;
};

export default function AboutPublishedContent(props: AboutPublishedContentProps) {
  if (!props.model.published) return null;

  return (
    <>
      <Show when={props.model.showIntro}>
        <AboutIntroSection model={props.model} />
      </Show>
      <Show when={props.model.showAffiliation}>
        <AboutAffiliationSection model={props.model} />
      </Show>
      <Show when={props.model.showStatement}>
        <AboutResearchStatementSection model={props.model} />
      </Show>
      <Show when={props.model.showExpertise}>
        <AboutExpertiseSection model={props.model} />
      </Show>
      <Show when={props.model.showScholarly}>
        <AboutScholarlySection model={props.model} />
      </Show>
      <Show when={props.model.showCollaboration}>
        <AboutCollaborationSection model={props.model} />
      </Show>
    </>
  );
}
