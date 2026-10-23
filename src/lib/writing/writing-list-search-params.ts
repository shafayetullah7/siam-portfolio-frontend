import type { PublicWritingListParams } from "~/lib/api/endpoints/public/writing.api";

export type WritingListSort = "publishedAtDesc" | "titleAsc";

export type WritingListSearchParams = {
  q?: string;
  tag?: string;
  series?: string;
  page?: string;
  sort?: WritingListSort;
};

export type WritingListApiParams = PublicWritingListParams;

type SearchParamsRecord = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isWritingListSort(value: string | undefined): value is WritingListSort {
  return value === "publishedAtDesc" || value === "titleAsc";
}

export function parseWritingListSearchParams(
  searchParams: SearchParamsRecord,
): WritingListSearchParams {
  const q = first(searchParams.q)?.trim();
  const tag = first(searchParams.tag)?.trim();
  const series = first(searchParams.series)?.trim();
  const page = first(searchParams.page)?.trim();
  const sortRaw = first(searchParams.sort)?.trim();
  const sort = isWritingListSort(sortRaw) ? sortRaw : undefined;

  return {
    ...(q ? { q } : {}),
    ...(tag ? { tag } : {}),
    ...(series ? { series } : {}),
    ...(page ? { page } : {}),
    ...(sort ? { sort } : {}),
  };
}

export function writingListSearchParamsToApi(
  params: WritingListSearchParams,
  options?: {
    excludeFeaturedOnHub?: boolean;
    featuredOnHub?: boolean;
    limit?: number;
  },
): WritingListApiParams {
  const page = params.page ? Number.parseInt(params.page, 10) : undefined;

  return {
    ...(params.q ? { q: params.q } : {}),
    ...(params.tag ? { tag: params.tag } : {}),
    ...(params.series ? { series: params.series } : {}),
    ...(params.sort ? { sort: params.sort } : {}),
    ...(page && page > 0 ? { page } : {}),
    ...(options?.limit != null ? { limit: options.limit } : {}),
    ...(options?.featuredOnHub === true ? { featuredOnHub: true } : {}),
    ...(options?.excludeFeaturedOnHub === true
      ? { excludeFeaturedOnHub: true }
      : {}),
  };
}

export function writingListHasActiveFilters(
  params: WritingListSearchParams,
): boolean {
  return Boolean(
    params.q ||
      params.tag ||
      params.series ||
      (params.sort && params.sort !== "publishedAtDesc"),
  );
}

export function writingListPageNumber(params: WritingListSearchParams): number {
  const page = params.page ? Number.parseInt(params.page, 10) : 1;
  return page > 0 ? page : 1;
}

type SetSearchParams = (
  params: Record<string, string | undefined | null>,
  options?: { replace?: boolean },
) => void;

export function setWritingListFilters(
  setSearchParams: SetSearchParams,
  patch: Partial<WritingListSearchParams>,
  options?: { replace?: boolean },
) {
  const next: Record<string, string | undefined | null> = { page: null };
  if ("q" in patch) next.q = patch.q ?? null;
  if ("tag" in patch) next.tag = patch.tag ?? null;
  if ("series" in patch) next.series = patch.series ?? null;
  if ("sort" in patch) {
    next.sort =
      patch.sort && patch.sort !== "publishedAtDesc" ? patch.sort : null;
  }
  setSearchParams(next, options);
}

export function clearWritingListFilters(setSearchParams: SetSearchParams) {
  setSearchParams({
    q: null,
    tag: null,
    series: null,
    sort: null,
    page: null,
  });
}

export function setWritingListPage(
  setSearchParams: SetSearchParams,
  page: number,
) {
  setSearchParams({
    page: page <= 1 ? null : String(page),
  });
}
