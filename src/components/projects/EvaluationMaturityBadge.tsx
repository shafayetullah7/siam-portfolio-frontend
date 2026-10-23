import type { EvaluationMaturity } from "~/lib/api/types/project.types";
import { EVALUATION_MATURITY_LABELS } from "~/lib/projects/projectLabels";

export type EvaluationMaturityBadgeProps = {
  maturity: EvaluationMaturity;
};

function maturityBadgeClass(maturity: EvaluationMaturity): string {
  switch (maturity) {
    case "verified":
      return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200";
    case "provisional":
      return "bg-amber-500/15 text-amber-900 dark:text-amber-100";
    default:
      return "bg-surface-container text-ink-muted";
  }
}

export default function EvaluationMaturityBadge(
  props: EvaluationMaturityBadgeProps,
) {
  return (
    <span
      class={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${maturityBadgeClass(props.maturity)}`}
    >
      {EVALUATION_MATURITY_LABELS[props.maturity]}
    </span>
  );
}
