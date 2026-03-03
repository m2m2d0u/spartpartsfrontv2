import { Skeleton } from "@/components/ui/skeleton";

type DataTableSkeletonProps = {
  columns: number;
  rows?: number;
};

export function DataTableSkeleton({
  columns,
  rows = 5,
}: DataTableSkeletonProps) {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-64" />
      </div>
      {/* Table skeleton */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {/* Data rows */}
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-4">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <Skeleton key={colIdx} className="h-8 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
