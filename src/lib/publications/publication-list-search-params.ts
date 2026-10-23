import type { PublicationType } from "~/lib/api/types/publication.types";

export type PublicationListSearchParams = {
  q?: string;
  year?: string;
  type?: PublicationType;
  theme?: string;
  page?: string;
  group?: "year";
};

export type PublicationListApiParams = {
  q?: string;
  year?: number;
  type?: PublicationType;
  theme?: string;
  page?: number;
  limit?: number;
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parsePublicationListSearchParams(
  searchParams: SearchParamsRecord,
): PublicationListSearchParams {
  const q = first(searchParams.q)?.trim();
  const year = first(searchParams.year)?.trim();
  const typeRaw = first(searchParams.type)?.trim();
  const theme = first(searchParams.theme)?.trim();
  const page = first(searchParams.page)?.trim();
  const groupRaw = first(searchParams.group)?.trim();

  const type = isPublicationType(typeRaw) ? typeRaw : undefined;
  const group = groupRaw === "year" ? "year" : undefined;

  return {
    ...(q ? { q } : {}),
    ...(year ? { year } : {}),
    ...(type ? { type } : {}),
    ...(theme ? { theme } : {}),
    ...(page ? { page } : {}),
    ...(group ? { group } : {}),
  };
}

function isPublicationType(value: string | undefined): value is PublicationType {
  return (
    value === "journal" ||
    value === "conference" ||
    value === "preprint" ||
    value === "workshop" ||
    value === "thesis" ||
    value === "other"
  );
}

export function publicationListSearchParamsToApi(
  params: PublicationListSearchParams,
): PublicationListApiParams {
  const page = params.page ? Number.parseInt(params.page, 10) : undefined;
  const year = params.year ? Number.parseInt(params.year, 10) : undefined;

  return {
    ...(params.q ? { q: params.q } : {}),
    ...(year && !Number.isNaN(year) ? { year } : {}),
    ...(params.type ? { type: params.type } : {}),
    ...(params.theme ? { theme: params.theme } : {}),
    ...(page && page > 0 ? { page } : {}),
  };
}

export function publicationListHasActiveFilters(
  params: PublicationListSearchParams,
): boolean {
  return Boolean(params.q || params.year || params.type || params.theme);
}

type SetSearchParams = (
  params: Record<string, string | undefined | null>,
  options?: { replace?: boolean },
) => void;

export function setPublicationListFilters(
  setSearchParams: SetSearchParams,
  patch: Partial<PublicationListSearchParams>,
  options?: { replace?: boolean },
) {
  const next: Record<string, string | undefined | null> = { page: null };
  if ("q" in patch) next.q = patch.q ?? null;
  if ("year" in patch) next.year = patch.year ?? null;
  if ("type" in patch) next.type = patch.type ?? null;
  if ("theme" in patch) next.theme = patch.theme ?? null;
  if ("group" in patch) next.group = patch.group ?? null;
  setSearchParams(next, options);
}

export function clearPublicationListFilters(
  setSearchParams: SetSearchParams,
) {
  setSearchParams({
    q: null,
    year: null,
    type: null,
    theme: null,
    group: null,
    page: null,
  });
}

export function setPublicationListPage(
  setSearchParams: SetSearchParams,
  page: number,
) {
  setSearchParams({
    page: page <= 1 ? null : String(page),
  });
}
