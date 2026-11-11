import type { ProfileExpertise } from "~/lib/api/types/home.types";

export type ExpertiseLinesForm = {
  domains: string;
  methodologies: string;
  tooling: string;
  practices: string;
};

export const EMPTY_EXPERTISE_LINES: ExpertiseLinesForm = {
  domains: "",
  methodologies: "",
  tooling: "",
  practices: "",
};

export function parseLinesToTopics(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function expertiseToLines(
  expertise: ProfileExpertise | null | undefined,
): ExpertiseLinesForm {
  if (!expertise) return { ...EMPTY_EXPERTISE_LINES };
  return {
    domains: expertise.domains.join("\n"),
    methodologies: expertise.methodologies.join("\n"),
    tooling: expertise.tooling.join("\n"),
    practices: expertise.practices.join("\n"),
  };
}

export function linesToExpertise(
  lines: ExpertiseLinesForm,
): ProfileExpertise | null {
  const domains = parseLinesToTopics(lines.domains);
  const methodologies = parseLinesToTopics(lines.methodologies);
  const tooling = parseLinesToTopics(lines.tooling);
  const practices = parseLinesToTopics(lines.practices);
  if (
    !domains.length &&
    !methodologies.length &&
    !tooling.length &&
    !practices.length
  ) {
    return null;
  }
  return { domains, methodologies, tooling, practices };
}
