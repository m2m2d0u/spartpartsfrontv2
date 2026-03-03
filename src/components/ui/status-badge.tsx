import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        success: "bg-[#ECFDF3] text-[#027A48] dark:bg-[#027A48]/10 dark:text-[#6CE9A6]",
        warning: "bg-[#FFFAEB] text-[#B54708] dark:bg-[#B54708]/10 dark:text-[#FDB022]",
        error: "bg-[#FEF3F2] text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]",
        info: "bg-[#EFF8FF] text-[#175CD3] dark:bg-[#175CD3]/10 dark:text-[#84CAFF]",
        neutral: "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type StatusBadgeProps = VariantProps<typeof statusBadgeVariants> & {
  children: React.ReactNode;
  className?: string;
};

export function StatusBadge({
  variant,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
