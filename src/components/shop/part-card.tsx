import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { PortalPart } from "@/types/portal";
import { formatCurrency, type CurrencyFormatOptions } from "@/lib/format-number";
import { StockBadge } from "./stock-badge";

type PartCardProps = {
  part: PortalPart;
  currencyOptions?: CurrencyFormatOptions;
};

export function PartCard({ part, currencyOptions }: PartCardProps) {
  const t = useTranslations("shop");

  return (
    <Link
      href={`/parts/${part.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stroke bg-white transition hover:shadow-md dark:border-dark-3 dark:bg-dark-2"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-2 dark:bg-dark-3">
        {part.mainImageUrl ? (
          <Image
            src={part.mainImageUrl}
            alt={part.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-dark-5 dark:text-dark-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <StockBadge totalStock={part.totalStock} />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs text-dark-5 dark:text-dark-6">
          {t("partNumber", { number: part.partNumber })}
        </p>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-dark dark:text-white">
          {part.name}
        </h3>

        {part.categoryName && (
          <span className="mb-2 inline-block self-start rounded-md bg-gray-2 px-2 py-0.5 text-xs text-dark-5 dark:bg-dark-3 dark:text-dark-6">
            {part.categoryName}
          </span>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(part.sellingPrice, currencyOptions)}
          </span>
        </div>
      </div>
    </Link>
  );
}
