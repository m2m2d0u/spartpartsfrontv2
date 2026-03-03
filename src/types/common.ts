export type SortDirection = "asc" | "desc";

export type SortState = {
  column: string;
  direction: SortDirection;
};

export type FilterState = {
  key: string;
  value: string | string[];
};

/** Mirrors backend PagedResponse<T> */
export type PagedResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

/** Mirrors backend ApiResponse<T> */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string> | null;
  timestamp: string;
};
