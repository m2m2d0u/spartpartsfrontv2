import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-dark-6 [&_svg]:size-12">{icon}</div>
      )}
      <h3 className="text-lg font-medium text-dark dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-body-sm text-dark-6">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
