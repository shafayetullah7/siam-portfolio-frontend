import type {
  ProjectStatus,
  ProjectType,
} from "~/lib/api/types/project.types";

export type ProjectListSearchParams = {
  q?: string;
  tag?: string;
  type?: ProjectType;
  status?: ProjectStatus;
  page?: string;
};

export type ProjectListApiParams = {
  q?: string;
  tag?: string;
  projectType?: ProjectType;
  projectStatus?: ProjectStatus;
  page?: number;
  limit?: number;
  featured?: boolean;
  excludeFeatured?: boolean;
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isProjectType(value: string | undefined): value is ProjectType {
  return (
    value === "research_prototype" ||
    value === "production" ||
    value === "open_source" ||
    value === "coursework" ||
    value === "competition" ||
    value === "other"
  );
}

function isProjectStatus(value: string | undefined): value is ProjectStatus {
  return (
    value === "ongoing" ||
    value === "completed" ||
    value === "maintained" ||
    value === "archived"
  );
}

export function parseProjectListSearchParams(
  searchParams: SearchParamsRecord,
): ProjectListSearchParams {
  const q = first(searchParams.q)?.trim();
  const tag = first(searchParams.tag)?.trim();
  const typeRaw = first(searchParams.type)?.trim();
  const statusRaw = first(searchParams.status)?.trim();
  const page = first(searchParams.page)?.trim();

  const type = isProjectType(typeRaw) ? typeRaw : undefined;
  const status = isProjectStatus(statusRaw) ? statusRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(tag ? { tag } : {}),
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
    ...(page ? { page } : {}),
  };
}

export function projectListSearchParamsToApi(
  params: ProjectListSearchParams,
  options?: { excludeFeatured?: boolean; featured?: boolean; limit?: number },
): ProjectListApiParams {
  const page = params.page ? Number.parseInt(params.page, 10) : undefined;

  return {
    ...(params.q ? { q: params.q } : {}),
    ...(params.tag ? { tag: params.tag } : {}),
    ...(params.type ? { projectType: params.type } : {}),
    ...(params.status ? { projectStatus: params.status } : {}),
    ...(page && page > 0 ? { page } : {}),
    ...(options?.limit != null ? { limit: options.limit } : {}),
    ...(options?.featured === true ? { featured: true } : {}),
    ...(options?.excludeFeatured === true ? { excludeFeatured: true } : {}),
  };
}

export function projectListHasActiveFilters(
  params: ProjectListSearchParams,
): boolean {
  return Boolean(params.q || params.tag || params.type || params.status);
}

export function projectListPageNumber(params: ProjectListSearchParams): number {
  const page = params.page ? Number.parseInt(params.page, 10) : 1;
  return page > 0 ? page : 1;
}

type SetSearchParams = (
  params: Record<string, string | undefined | null>,
  options?: { replace?: boolean },
) => void;

export function setProjectListFilters(
  setSearchParams: SetSearchParams,
  patch: Partial<ProjectListSearchParams>,
  options?: { replace?: boolean },
) {
  const next: Record<string, string | undefined | null> = { page: null };
  if ("q" in patch) next.q = patch.q ?? null;
  if ("tag" in patch) next.tag = patch.tag ?? null;
  if ("type" in patch) next.type = patch.type ?? null;
  if ("status" in patch) next.status = patch.status ?? null;
  setSearchParams(next, options);
}

export function clearProjectListFilters(setSearchParams: SetSearchParams) {
  setSearchParams({
    q: null,
    tag: null,
    type: null,
    status: null,
    page: null,
  });
}

export function setProjectListPage(
  setSearchParams: SetSearchParams,
  page: number,
) {
  setSearchParams({
    page: page <= 1 ? null : String(page),
  });
}
