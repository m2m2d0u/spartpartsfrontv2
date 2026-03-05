"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "./pagination";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  filterSlot?: React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
  title?: string;
  /** Server-side pagination: total number of elements across all pages */
  totalElements?: number;
  /** Server-side pagination: current 1-based page */
  currentPage?: number;
  /** Server-side pagination: callback when page changes */
  onPageChange?: (page: number) => void;
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  pageSize = 10,
  onSearch,
  searchPlaceholder,
  filterSlot,
  emptyMessage,
  emptyDescription,
  title,
  totalElements,
  currentPage,
  onPageChange,
}: DataTableProps<T>) {
  const t = useTranslations("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [localPage, setLocalPage] = useState(1);

  const isServerPaginated = totalElements !== undefined && onPageChange !== undefined;

  // Client-side pagination
  const clientTotalItems = data.length;
  const clientTotalPages = Math.ceil(clientTotalItems / pageSize);
  const safeLocalPage = localPage > clientTotalPages && clientTotalPages > 0 ? clientTotalPages : localPage;
  if (safeLocalPage !== localPage) {
    setLocalPage(safeLocalPage);
  }

  // Resolved values depending on mode
  const activePage = isServerPaginated ? (currentPage ?? 1) : safeLocalPage;
  const totalItems = isServerPaginated ? totalElements : clientTotalItems;
  const totalPages = isServerPaginated
    ? Math.ceil(totalElements / pageSize)
    : clientTotalPages;

  const paginatedData = useMemo(() => {
    if (isServerPaginated) return data;
    const start = (safeLocalPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safeLocalPage, pageSize, isServerPaginated]);

  function handlePageChange(newPage: number) {
    if (isServerPaginated) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
    if (!isServerPaginated) setLocalPage(1);
    onSearch?.(value);
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-stroke px-4 py-4 dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          {title && (
            <h3 className="font-medium text-dark dark:text-white">{title}</h3>
          )}
          {filterSlot}
        </div>
        {onSearch && (
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder || t("search")}
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary sm:w-64"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-6"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M13.125 13.125L16.5 16.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M1.5 7.875a6.375 6.375 0 1112.75 0 6.375 6.375 0 01-12.75 0z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Table */}
      {data.length === 0 ? (
        <EmptyState
          title={emptyMessage || t("noData")}
          description={emptyDescription}
          className="py-16"
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="border-t border-stroke px-4 py-4 dark:border-dark-3 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-body-sm text-dark-6">
                {t("showing", {
                  start: (activePage - 1) * pageSize + 1,
                  end: Math.min(activePage * pageSize, totalItems),
                  total: totalItems,
                })}
              </p>
              <Pagination
                page={activePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
