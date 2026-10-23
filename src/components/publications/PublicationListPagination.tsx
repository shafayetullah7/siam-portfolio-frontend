import type { PaginationMeta } from "~/lib/api/types";

export type PublicationListPaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
};

export default function PublicationListPagination(
  props: PublicationListPaginationProps,
) {
  if (props.meta.totalPages <= 1) {
    return null;
  }

  const rangeStart = () =>
    (props.meta.page - 1) * props.meta.limit + 1;
  const rangeEnd = () => rangeStart() + props.meta.itemCount - 1;

  return (
    <nav
      class="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label={props.ariaLabel ?? "Publications pagination"}
    >
      <p class="font-mono text-xs text-on-surface-variant">
        Showing {rangeStart()}–{rangeEnd()} of {props.meta.total}
      </p>
      <div class="flex gap-2">
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          disabled={props.meta.page <= 1}
          onClick={() => props.onPageChange(props.meta.page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          class="siam-btn-secondary text-sm"
          disabled={props.meta.page >= props.meta.totalPages}
          onClick={() => props.onPageChange(props.meta.page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
