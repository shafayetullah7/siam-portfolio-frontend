import type { HomeAffiliation } from "~/content";
import { formatAffiliationLine } from "./affiliationFormat";
import { HOME_SECTION_LABELS } from "./homeSectionLabels";

export type AffiliationStripProps = {
  affiliation: HomeAffiliation;
};

export default function AffiliationStrip(props: AffiliationStripProps) {
  const line = () => formatAffiliationLine(props.affiliation);

  return (
    <p
      id={HOME_SECTION_LABELS.affiliation.domId}
      class="scroll-mt-20 text-sm text-ink-muted"
    >
      {line()}
    </p>
  );
}
