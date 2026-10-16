import type { HomeAffiliation } from "~/content";
import { formatAffiliationLine } from "./affiliationFormat";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";

export type AffiliationStripProps = {
  affiliation: HomeAffiliation;
};

export default function AffiliationStrip(props: AffiliationStripProps) {
  const { role, organization, location } = props.affiliation;

  return (
    <div
      id={HOME_SECTION_LABELS.affiliation.domId}
      class="scroll-mt-20 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-dashed border-border-strong/50 pt-4 font-mono text-xs text-secondary"
    >
      <div class="flex items-center gap-1.5">
        <span class="text-primary" aria-hidden="true">●</span>
        <span>{role}</span>
      </div>
      <span class="text-border-strong" aria-hidden="true">•</span>
      <div class="flex items-center gap-1.5">
        <span class="text-primary" aria-hidden="true">●</span>
        <span>{organization}</span>
      </div>
      {location?.trim() ? (
        <>
          <span class="text-border-strong" aria-hidden="true">•</span>
          <div class="flex items-center gap-1.5">
            <span class="text-primary" aria-hidden="true">●</span>
            <span>{location}</span>
          </div>
        </>
      ) : null}
      <span class="sr-only">{formatAffiliationLine(props.affiliation)}</span>
    </div>
  );
}
