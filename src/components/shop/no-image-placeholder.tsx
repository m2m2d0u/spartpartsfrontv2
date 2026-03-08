import { cn } from "@/lib/utils";

type PlaceholderSize = "xs" | "sm" | "md" | "lg";

type NoImagePlaceholderProps = {
  /** Controls the icon size and overall look */
  size?: PlaceholderSize;
  className?: string;
};

const iconSizes: Record<PlaceholderSize, { icon: number; label: string }> = {
  xs: { icon: 16, label: "text-[8px]" },
  sm: { icon: 24, label: "text-[10px]" },
  md: { icon: 48, label: "text-xs" },
  lg: { icon: 64, label: "text-sm" },
};

export function NoImagePlaceholder({
  size = "md",
  className,
}: NoImagePlaceholderProps) {
  const { icon } = iconSizes[size];

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-1 bg-gray-2 dark:bg-dark-3",
        className,
      )}
    >
      {/* Camera / image icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        className="text-dark-5/50 dark:text-dark-6/50"
      >
        {/* Outer rounded rectangle (image frame) */}
        <rect
          x="4"
          y="8"
          width="40"
          height="32"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* Mountain / landscape shape */}
        <path
          d="M4 34l10-12 6 6 8-10 16 16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.08"
        />
        {/* Sun circle */}
        <circle
          cx="15"
          cy="18"
          r="4"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.08"
        />
      </svg>
    </div>
  );
}
