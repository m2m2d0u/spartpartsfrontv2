"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCart } from "@/context/cart-context";
import { placeOrder } from "@/services/shop.service";
import type { CurrencyFormatOptions } from "@/lib/format-number";
import { formatCurrency } from "@/lib/format-number";
import InputGroup from "@/components/FormElements/InputGroup";
import { EmptyState } from "@/components/ui/empty-state";

type CheckoutViewProps = {
  currencyOptions?: CurrencyFormatOptions;
};

export function CheckoutView({ currencyOptions }: CheckoutViewProps) {
  const t = useTranslations("shop");
  const router = useRouter();
  const { items, totalPrice, loaded, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required(t("validationRequired")),
    email: Yup.string()
      .email(t("validationEmail"))
      .required(t("validationRequired")),
    phone: Yup.string().required(t("validationRequired")),
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    postalCode: Yup.string(),
    country: Yup.string(),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      setError("");
      try {
        const result = await placeOrder({
          customer: {
            name: values.name,
            email: values.email,
            phone: values.phone,
            street: values.street || undefined,
            city: values.city || undefined,
            state: values.state || undefined,
            postalCode: values.postalCode || undefined,
            country: values.country || undefined,
          },
          items: items.map((item) => ({
            partId: item.partId,
            quantity: item.quantity,
          })),
          notes: values.notes || undefined,
        });
        clearCart();
        router.push(`/orders/${result.orderNumber}`);
      } catch {
        setError(t("orderFailed"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg
          className="h-8 w-8 animate-spin text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer form */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2 sm:p-6">
            <h2 className="mb-6 text-lg font-semibold text-dark dark:text-white">
              {t("customerInfo")}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputGroup
                label={t("fullName")}
                name="name"
                type="text"
                placeholder={t("fullNamePlaceholder")}
                required
                value={formik.values.name}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name ? formik.errors.name : undefined}
              />
              <InputGroup
                label={t("email")}
                name="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                required
                value={formik.values.email}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email ? formik.errors.email : undefined}
              />
              <InputGroup
                label={t("phone")}
                name="phone"
                type="tel"
                placeholder={t("phonePlaceholder")}
                required
                value={formik.values.phone}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone ? formik.errors.phone : undefined}
              />
              <InputGroup
                label={t("street")}
                name="street"
                type="text"
                placeholder={t("streetPlaceholder")}
                value={formik.values.street}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={t("city")}
                name="city"
                type="text"
                placeholder={t("cityPlaceholder")}
                value={formik.values.city}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={t("state")}
                name="state"
                type="text"
                placeholder={t("statePlaceholder")}
                value={formik.values.state}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={t("postalCode")}
                name="postalCode"
                type="text"
                placeholder={t("postalCodePlaceholder")}
                value={formik.values.postalCode}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={t("country")}
                name="country"
                type="text"
                placeholder={t("countryPlaceholder")}
                value={formik.values.country}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="mt-4">
              <label className="text-body-sm font-medium text-dark dark:text-white">
                {t("orderNotes")}
              </label>
              <textarea
                name="notes"
                rows={3}
                placeholder={t("orderNotesPlaceholder")}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {t("orderSummary")}
            </h3>

            {/* Items */}
            <div className="max-h-64 space-y-3 overflow-y-auto border-b border-stroke pb-4 dark:border-dark-3">
              {items.map((item) => (
                <div key={item.partId} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-2 dark:bg-dark-3">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-dark-5 dark:text-dark-6">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 truncate">
                    <p className="truncate text-sm font-medium text-dark dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">
                      x{item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-dark dark:text-white">
                    {formatCurrency(item.unitPrice * item.quantity, currencyOptions)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between py-4 text-base">
              <span className="font-semibold text-dark dark:text-white">
                {t("orderTotal")}
              </span>
              <span className="font-bold text-primary">
                {formatCurrency(totalPrice, currencyOptions)}
              </span>
            </div>

            {error && (
              <p className="mb-3 rounded-lg bg-red/10 px-4 py-2 text-sm text-red">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? t("placingOrder") : t("placeOrder")}
            </button>

            <Link
              href="/cart"
              className="mt-3 flex w-full items-center justify-center rounded-lg border border-stroke px-6 py-3 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
            >
              {t("viewCart")}
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
