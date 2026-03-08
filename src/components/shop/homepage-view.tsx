import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { PortalPart, PortalCategory } from "@/types/portal";
import type { CurrencyFormatOptions } from "@/lib/format-number";
import { PartCard } from "./part-card";
import { NoImagePlaceholder } from "./no-image-placeholder";

type HomepageViewProps = {
  categories: PortalCategory[];
  featuredParts: PortalPart[];
  currencyOptions?: CurrencyFormatOptions;
};

export function HomepageView({
  categories,
  featuredParts,
  currencyOptions,
}: HomepageViewProps) {
  const t = useTranslations("shop");

  return (
    <div className="-mx-4 -mt-6 sm:-mx-6 lg:-mx-8">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#3b35c4] px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-white/10" />
        </div>

        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            {t("heroDescription")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg transition hover:bg-gray-1 hover:shadow-xl"
            >
              {t("heroCta")}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured Categories ─── */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-dark dark:text-white sm:text-3xl">
              {t("featuredCategories")}
            </h2>
            <Link
              href="/catalog"
              className="hidden text-sm font-medium text-primary transition hover:text-primary/80 sm:inline-flex sm:items-center sm:gap-1"
            >
              {t("viewAllCategories")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category.id}
                href={`/catalog?categoryId=${category.id}`}
                className="group flex flex-col items-center rounded-xl border border-stroke bg-white p-6 text-center transition hover:border-primary hover:shadow-md dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition group-hover:bg-primary/20">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <NoImagePlaceholder size="sm" className="rounded-full bg-transparent dark:bg-transparent" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-dark dark:text-white">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
                  {t("partsCount", { count: category.partCount })}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Featured Products ─── */}
      {featuredParts.length > 0 && (
        <section className="bg-gray-1 dark:bg-dark">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark dark:text-white sm:text-3xl">
                {t("featuredProducts")}
              </h2>
              <Link
                href="/catalog"
                className="hidden text-sm font-medium text-primary transition hover:text-primary/80 sm:inline-flex sm:items-center sm:gap-1"
              >
                {t("viewAllProducts")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredParts.slice(0, 8).map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  currencyOptions={currencyOptions}
                />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:text-primary/80"
              >
                {t("viewAllProducts")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Why Choose Us ─── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 className="mb-12 text-center text-2xl font-bold text-dark dark:text-white sm:text-3xl">
          {t("whyChooseUs")}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Quality Parts */}
          <div className="flex flex-col items-center rounded-xl border border-stroke bg-white p-8 text-center transition hover:shadow-md dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF3] dark:bg-[#027A48]/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#027A48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-semibold text-dark dark:text-white">
              {t("featureQualityTitle")}
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              {t("featureQualityDesc")}
            </p>
          </div>

          {/* Secure Payments */}
          <div className="flex flex-col items-center rounded-xl border border-stroke bg-white p-8 text-center transition hover:shadow-md dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF8FF] dark:bg-[#175CD3]/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#175CD3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-semibold text-dark dark:text-white">
              {t("featureSecureTitle")}
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              {t("featureSecureDesc")}
            </p>
          </div>

          {/* Fast Shipping */}
          <div className="flex flex-col items-center rounded-xl border border-stroke bg-white p-8 text-center transition hover:shadow-md dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFFAEB] dark:bg-[#B54708]/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B54708" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-semibold text-dark dark:text-white">
              {t("featureShippingTitle")}
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              {t("featureShippingDesc")}
            </p>
          </div>

          {/* Expert Support */}
          <div className="flex flex-col items-center rounded-xl border border-stroke bg-white p-8 text-center transition hover:shadow-md dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F3FF] dark:bg-[#5750F1]/10">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5750F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <h3 className="mb-2 text-base font-semibold text-dark dark:text-white">
              {t("featureSupportTitle")}
            </h3>
            <p className="text-sm text-dark-5 dark:text-dark-6">
              {t("featureSupportDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-gradient-to-r from-dark to-dark-2 dark:from-dark-2 dark:to-dark-3">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            {t("ctaDescription")}
          </p>
          <Link
            href="/catalog"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-primary/90 hover:shadow-xl"
          >
            {t("ctaCta")}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
