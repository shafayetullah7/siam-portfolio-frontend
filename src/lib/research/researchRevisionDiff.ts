import type { ResearchThemeRevisionSnapshot } from "~/lib/api/types/content-revision.types";

export type RevisionFieldChange = {
  field: string;
  label: string;
  beforeText: string;
  afterText: string;
};

export type RevisionSnapshotField = {
  field: string;
  label: string;
  valueText: string;
};

const EMPTY = "(empty)";

export const REVISION_FIELD_ORDER: (keyof ResearchThemeRevisionSnapshot)[] = [
  "title",
  "slug",
  "summary",
  "themeStatus",
  "publishStatus",
  "problem",
  "significance",
  "objectives",
  "approach",
  "findings",
  "limitations",
  "futureWork",
  "tags",
  "acknowledgments",
  "funding",
  "collaborators",
  "resources",
  "publicationIds",
  "projectIds",
  "seoTitle",
  "seoDescription",
  "sortOrder",
  "featuredOnHome",
  "linkLabel",
  "coverMediaId",
  "publishedAt",
  "scheduledAt",
  "archivedAt",
];

export const REVISION_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  slug: "Slug",
  summary: "Summary",
  themeStatus: "Theme status",
  publishStatus: "Publish status",
  problem: "Problem",
  significance: "Significance",
  objectives: "Objectives",
  approach: "Approach",
  findings: "Findings",
  limitations: "Limitations",
  futureWork: "Future work",
  tags: "Tags",
  acknowledgments: "Acknowledgments",
  funding: "Funding",
  collaborators: "Collaborators",
  resources: "Resources",
  publicationIds: "Linked publications",
  projectIds: "Linked projects",
  seoTitle: "SEO title",
  seoDescription: "SEO description",
  sortOrder: "Sort order",
  featuredOnHome: "Featured on home",
  linkLabel: "Card link label",
  coverMediaId: "Cover image",
  publishedAt: "Published at",
  scheduledAt: "Scheduled at",
  archivedAt: "Archived at",
};

function isEmptyValue(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function formatScalar(value: unknown): string {
  if (value == null) return EMPTY;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    const t = value.trim();
    return t === "" ? EMPTY : t;
  }
  return String(value);
}

function formatIsoDateTime(value: unknown): string {
  if (value == null) return EMPTY;
  const raw = String(value).trim();
  if (raw === "") return EMPTY;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function formatTags(tags: string[] | null | undefined): string {
  if (!tags?.length) return EMPTY;
  return tags.join(", ");
}

function formatIdList(ids: string[] | undefined): string {
  if (!ids?.length) return EMPTY;
  return `${ids.length} linked`;
}

function formatCollaborators(
  rows: ResearchThemeRevisionSnapshot["collaborators"],
): string {
  if (!rows?.length) return EMPTY;
  return `${rows.length} (${rows.map((c) => c.name).join(", ")})`;
}

function formatResources(
  rows: ResearchThemeRevisionSnapshot["resources"],
): string {
  if (!rows?.length) return EMPTY;
  return `${rows.length} (${rows.map((r) => r.label).join(", ")})`;
}

function snapshotFieldText(
  key: keyof ResearchThemeRevisionSnapshot,
  snap: Partial<ResearchThemeRevisionSnapshot> | undefined,
): string {
  if (!snap) return EMPTY;
  const value = snap[key];
  switch (key) {
    case "tags":
      return formatTags(value as string[] | null | undefined);
    case "publicationIds":
    case "projectIds":
      return formatIdList(value as string[] | undefined);
    case "collaborators":
      return formatCollaborators(
        value as ResearchThemeRevisionSnapshot["collaborators"],
      );
    case "resources":
      return formatResources(
        value as ResearchThemeRevisionSnapshot["resources"],
      );
    case "featuredOnHome":
      return formatScalar(value);
    case "publishedAt":
    case "scheduledAt":
    case "archivedAt":
      return formatIsoDateTime(value);
    default:
      return formatScalar(value);
  }
}

function valuesEqual(
  key: keyof ResearchThemeRevisionSnapshot,
  before: Partial<ResearchThemeRevisionSnapshot> | undefined,
  after: Partial<ResearchThemeRevisionSnapshot> | undefined,
): boolean {
  const b = snapshotFieldText(key, before);
  const a = snapshotFieldText(key, after);
  return b === a;
}

/** Labels for fields present in a stored revision change payload. */
export function listRevisionChangeFields(
  snap: Partial<ResearchThemeRevisionSnapshot> | undefined,
): RevisionSnapshotField[] {
  if (!snap) return [];
  const rows: RevisionSnapshotField[] = [];
  for (const key of REVISION_FIELD_ORDER) {
    const valueText = snapshotFieldText(key, snap);
    if (valueText === EMPTY) continue;
    rows.push({
      field: key,
      label: REVISION_FIELD_LABELS[key] ?? key,
      valueText,
    });
  }
  return rows;
}

/** Diff snapshot after a save vs the previous snapshot (older revision). */
export function diffResearchThemeSnapshots(
  before: Partial<ResearchThemeRevisionSnapshot> | undefined,
  after: Partial<ResearchThemeRevisionSnapshot> | undefined,
): RevisionFieldChange[] {
  const changes: RevisionFieldChange[] = [];
  for (const key of REVISION_FIELD_ORDER) {
    if (valuesEqual(key, before, after)) continue;
    changes.push({
      field: key,
      label: REVISION_FIELD_LABELS[key] ?? key,
      beforeText: snapshotFieldText(key, before),
      afterText: snapshotFieldText(key, after),
    });
  }
  return changes;
}

export function summarizeRevisionChanges(
  changes: RevisionFieldChange[],
  maxLabels = 3,
): string {
  if (changes.length === 0) return "No field changes";
  const labels = changes.map((c) => c.label);
  if (labels.length <= maxLabels) return labels.join(", ");
  const shown = labels.slice(0, maxLabels).join(", ");
  return `${shown} +${labels.length - maxLabels} more`;
}

export function summarizeRevisionFieldLabels(
  fields: RevisionSnapshotField[],
  maxLabels = 3,
): string {
  if (fields.length === 0) return "No field changes";
  const labels = fields.map((f) => f.label);
  if (labels.length <= maxLabels) return labels.join(", ");
  const shown = labels.slice(0, maxLabels).join(", ");
  return `${shown} +${labels.length - maxLabels} more`;
}
