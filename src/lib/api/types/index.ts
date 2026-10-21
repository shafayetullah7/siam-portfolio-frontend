/**
 * API types — TypeScript only (no Zod). See docs/api-convention.md
 */

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  statusCode: number;
  /** @deprecated Legacy nested shape — prefer top-level validationErrors */
  error?: string | { code?: string; validationErrors?: FieldError[] };
  validationErrors?: FieldError[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: ApiFailure | unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface PaginationMeta {
  total: number;
  page: number;
  /** Requested max items per page. */
  limit: number;
  /** Items returned on this page (`items.length`; ≤ limit on the last page). */
  itemCount: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}
