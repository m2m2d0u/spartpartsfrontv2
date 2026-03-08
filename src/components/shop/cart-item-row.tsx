"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CartItem } from "@/context/cart-context";
import type { CurrencyFormatOptions } from "@/lib/format-number";
import { formatCurrency } from "@/lib/format-number";
import { QuantitySelector } from "./quantity-selector";

type CartItemRowProps = {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  currencyOptions?: CurrencyFormatOptions;
};

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  currencyOptions,
}: CartItemRowProps) {
  const t = useTranslations("shop");

  return (
    <div className="flex items-center gap-4 border-b border-stroke py-4 last:border-0 dark:border-dark-3">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-2 dark:bg-dark-3">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-dark-5 dark:text-dark-6">
            <svg
              width="24"
              height="24"
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
      </div>

      {/* Details */}
      <div className="flex-1 space-y-1">
        <h3 className="text-sm font-semibold text-dark dark:text-white">
          {item.name}
        </h3>
        <p className="text-xs text-dark-5 dark:text-dark-6">
          {t("partNumber", { number: item.partNumber })}
        </p>
        <p className="text-sm font-medium text-primary">
          {formatCurrency(item.unitPrice, currencyOptions)}
        </p>
      </div>

      {/* Quantity */}
      <div className="hidden sm:block">
        <QuantitySelector
          value={item.quantity}
          onChange={onUpdateQuantity}
          max={item.maxStock}
        />
      </div>

      {/* Line total */}
      <div className="hidden text-right sm:block">
        <span className="text-sm font-semibold text-dark dark:text-white">
          {formatCurrency(item.unitPrice * item.quantity, currencyOptions)}
        </span>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="shrink-0 rounded-lg p-2 text-dark-5 transition hover:bg-red/10 hover:text-red dark:text-dark-6"
        title={t("removeItem")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      {/* Mobile quantity + total */}
      <div className="flex w-full items-center justify-between sm:hidden">
        <QuantitySelector
          value={item.quantity}
          onChange={onUpdateQuantity}
          max={item.maxStock}
        />
        <span className="text-sm font-semibold text-dark dark:text-white">
          {formatCurrency(item.unitPrice * item.quantity, currencyOptions)}
        </span>
      </div>
    </div>
  );
}
