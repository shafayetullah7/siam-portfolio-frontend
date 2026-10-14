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

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
