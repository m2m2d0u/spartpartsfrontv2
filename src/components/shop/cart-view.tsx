"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/cart-context";
import type { CurrencyFormatOptions } from "@/lib/format-number";
import { formatCurrency } from "@/lib/format-number";
import { CartItemRow } from "./cart-item-row";
import { EmptyState } from "@/components/ui/empty-state";

type CartViewProps = {
  currencyOptions?: CurrencyFormatOptions;
};

export function CartView({ currencyOptions }: CartViewProps) {
  const t = useTranslations("shop");
  const { items, totalPrice, loaded, updateQuantity, removeItem } = useCart();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg
          className="h-8 w-8 animate-spin text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={
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
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        }
        title={t("cartEmpty")}
        description={t("cartEmptyDescription")}
        action={
          <Link
            href="/catalog"
            className="inline-flex rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            {t("browseCatalog")}
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Items list */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            {t("shoppingCart")} ({t("itemsInCart", { count: items.length })})
          </h2>
          <div>
            {items.map((item) => (
              <CartItemRow
                key={item.partId}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.partId, qty)}
                onRemove={() => removeItem(item.partId)}
                currencyOptions={currencyOptions}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Order summary sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
          <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
            {t("orderSummary")}
          </h3>

          <div className="space-y-3 border-b border-stroke pb-4 dark:border-dark-3">
            <div className="flex justify-between text-sm">
              <span className="text-dark-5 dark:text-dark-6">
                {t("subtotal")}
              </span>
              <span className="font-medium text-dark dark:text-white">
                {formatCurrency(totalPrice, currencyOptions)}
              </span>
            </div>
          </div>

          <div className="flex justify-between py-4 text-base">
            <span className="font-semibold text-dark dark:text-white">
              {t("orderTotal")}
            </span>
            <span className="font-bold text-primary">
              {formatCurrency(totalPrice, currencyOptions)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            {t("proceedToCheckout")}
          </Link>

          <Link
            href="/catalog"
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-stroke px-6 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
