import type {
  EvaluationMaturity,
  ProjectResourceType,
  ProjectSectionKind,
  ProjectStatus,
  ProjectType,
} from "~/lib/api/types/project.types";

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  research_prototype: "Research prototype",
  production: "Production",
  open_source: "Open source",
  coursework: "Coursework",
  competition: "Competition",
  other: "Other",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  ongoing: "Ongoing",
  completed: "Completed",
  maintained: "Maintained",
  archived: "Archived",
};

export const EVALUATION_MATURITY_LABELS: Record<EvaluationMaturity, string> = {
  verified: "Verified",
  provisional: "Provisional",
  experimental: "Experimental",
};

export const PROJECT_SECTION_KINDS: ProjectSectionKind[] = [
  "problem",
  "context",
  "responsibilities",
  "solution",
  "data_methods",
  "evaluation",
  "results",
  "limitations",
  "future_work",
  "custom",
];

export const PROJECT_SECTION_KIND_LABELS: Record<ProjectSectionKind, string> =
  {
    problem: "Problem",
    context: "Context",
    responsibilities: "Responsibilities",
    solution: "Solution",
    data_methods: "Data & methods",
    evaluation: "Evaluation",
    results: "Results",
    limitations: "Limitations",
    future_work: "Future work",
    custom: "Custom",
  };

export const PROJECT_RESOURCE_TYPES: ProjectResourceType[] = [
  "repo",
  "demo",
  "paper",
  "dataset",
  "model_card",
  "documentation",
  "video",
  "other",
];

export const PROJECT_RESOURCE_TYPE_LABELS: Record<
  ProjectResourceType,
  string
> = {
  repo: "Repository",
  demo: "Demo",
  paper: "Paper",
  dataset: "Dataset",
  model_card: "Model card",
  documentation: "Documentation",
  video: "Video",
  other: "Other",
};

export function tagsToInput(tags: string[] | null | undefined): string {
  return tags?.join(", ") ?? "";
}

export function parseTagsFromInput(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
