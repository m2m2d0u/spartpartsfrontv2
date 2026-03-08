import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PortalOrderConfirmation } from "@/types/portal";
import type { CurrencyFormatOptions } from "@/lib/format-number";
import { formatCurrency } from "@/lib/format-number";

type OrderConfirmationViewProps = {
  order: PortalOrderConfirmation;
  currencyOptions?: CurrencyFormatOptions;
};

export function OrderConfirmationView({
  order,
  currencyOptions,
}: OrderConfirmationViewProps) {
  const t = useTranslations("shop");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Success header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ECFDF3] dark:bg-[#027A48]/10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#027A48"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-dark dark:text-white">
          {t("thankYou")}
        </h1>
        <p className="mt-2 text-dark-5 dark:text-dark-6">
          {t("orderConfirmationMessage")}
        </p>
      </div>

      {/* Order details card */}
      <div className="rounded-xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        {/* Order number & status */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stroke pb-4 dark:border-dark-3">
          <div>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              {t("orderNumber", { number: order.orderNumber })}
            </p>
            <p className="text-xs text-dark-5 dark:text-dark-6">
              {t("orderDate")}:{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className="rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-medium text-[#027A48] dark:bg-[#027A48]/10 dark:text-[#6CE9A6]">
            {order.status}
          </span>
        </div>

        {/* Items */}
        <h3 className="mb-3 text-sm font-semibold text-dark dark:text-white">
          {t("orderItems")}
        </h3>
        <div className="mb-4 space-y-3">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex-1">
                <span className="font-medium text-dark dark:text-white">
                  {item.partName}
                </span>
                <span className="ml-2 text-dark-5 dark:text-dark-6">
                  ({item.partNumber}) x{item.quantity}
                </span>
              </div>
              <span className="font-medium text-dark dark:text-white">
                {formatCurrency(item.totalPrice, currencyOptions)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-stroke pt-4 dark:border-dark-3">
          <span className="text-base font-semibold text-dark dark:text-white">
            {t("orderTotal")}
          </span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(order.totalAmount, currencyOptions)}
          </span>
        </div>
      </div>

      {/* Customer info */}
      <div className="rounded-xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-3 text-sm font-semibold text-dark dark:text-white">
          {t("customerDetails")}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-5 dark:text-dark-6">
              {t("fullName")}
            </span>
            <span className="font-medium text-dark dark:text-white">
              {order.customerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-5 dark:text-dark-6">{t("email")}</span>
            <span className="font-medium text-dark dark:text-white">
              {order.customerEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-flex rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          {t("backToShop")}
        </Link>
      </div>
    </div>
  );
}
