export type SortDirection = "asc" | "desc";

export type SortState = {
  column: string;
  direction: SortDirection;
};

export type FilterState = {
  key: string;
  value: string | string[];
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Auditable = {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
};
