import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-6 xl:px-7.5">
        <h3 className="font-medium text-dark dark:text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-body-sm text-dark-6">{description}</p>
        )}
      </div>
      <div className={cn("p-4 sm:p-6 xl:p-7.5", className)}>{children}</div>
    </div>
  );
}
