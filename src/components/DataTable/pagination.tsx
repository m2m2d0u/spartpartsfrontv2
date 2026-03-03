"use client";

import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-stroke px-3 text-sm font-medium text-dark-5 transition hover:bg-gray-2 disabled:cursor-default disabled:opacity-40 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2"
      >
        Prev
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-dark-5">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p as number)}
            className={cn(
              "inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg text-sm font-medium transition",
              page === p
                ? "bg-primary text-white"
                : "border border-stroke text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-stroke px-3 text-sm font-medium text-dark-5 transition hover:bg-gray-2 disabled:cursor-default disabled:opacity-40 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-2"
      >
        Next
      </button>
    </div>
  );
}

function getVisiblePages(
  current: number,
  total: number,
): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}
