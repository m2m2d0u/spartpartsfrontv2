"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { PagedResponse } from "@/types";
import type { PortalPart, PortalCategory } from "@/types/portal";
import type { CurrencyFormatOptions } from "@/lib/format-number";
import { searchShopParts, getShopCarBrands, getShopCarModels } from "@/services/shop.service";
import { PartCard } from "./part-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchableSelect } from "@/components/FormElements/searchable-select";

type CatalogViewProps = {
  initialData: PagedResponse<PortalPart>;
  categories: PortalCategory[];
  currencyOptions?: CurrencyFormatOptions;
};

const PAGE_SIZE = 20;

export function CatalogView({
  initialData,
  categories,
  currencyOptions,
}: CatalogViewProps) {
  const t = useTranslations("shop");

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [page, setPage] = useState(0);

  // Data state
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Car brands & models
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [models, setModels] = useState<{ id: string; name: string; brandId: string }[]>([]);

  // Load car brands on mount
  useEffect(() => {
    getShopCarBrands().then(setBrands).catch(() => {});
  }, []);

  // Load car models when brand changes
  useEffect(() => {
    if (brandId) {
      getShopCarModels(brandId).then(setModels).catch(() => {});
    } else {
      setModels([]);
      setModelId("");
    }
  }, [brandId]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch parts when filters change
  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchShopParts(page, PAGE_SIZE, {
        name: debouncedSearch || undefined,
        categoryId: categoryId || undefined,
        carBrandId: brandId || undefined,
        carModelId: modelId || undefined,
      });
      setData(result);
    } catch {
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryId, brandId, modelId]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, categoryId, brandId, modelId]);

  const categoryItems = useMemo(
    () => [
      { value: "", label: t("allCategories") },
      ...categories.map((c) => ({ value: c.id, label: c.name })),
    ],
    [categories, t],
  );

  const brandItems = useMemo(
    () => [
      { value: "", label: t("allBrands") },
      ...brands.map((b) => ({ value: b.id, label: b.name })),
    ],
    [brands, t],
  );

  const filteredModels = useMemo(
    () => (brandId ? models.filter((m) => m.brandId === brandId) : models),
    [models, brandId],
  );

  const modelItems = useMemo(
    () => [
      { value: "", label: t("allModels") },
      ...filteredModels.map((m) => ({ value: m.id, label: m.name })),
    ],
    [filteredModels, t],
  );

  const hasFilters = debouncedSearch || categoryId || brandId || modelId;

  function handleClearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setCategoryId("");
    setBrandId("");
    setModelId("");
    setPage(0);
  }

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2 sm:p-6">
        {/* Search input */}
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-5 dark:text-dark-6"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-12 pr-4 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-48">
            <SearchableSelect
              items={categoryItems}
              value={categoryId}
              onChange={(v) => setCategoryId(v)}
              placeholder={t("allCategories")}
              searchPlaceholder={t("searchCategories")}
            />
          </div>

          <div className="w-48">
            <SearchableSelect
              items={brandItems}
              value={brandId}
              onChange={(v) => setBrandId(v)}
              placeholder={t("allBrands")}
              searchPlaceholder={t("searchBrands")}
            />
          </div>

          {brandId && (
            <div className="w-48">
              <SearchableSelect
                items={modelItems}
                value={modelId}
                onChange={(v) => setModelId(v)}
                placeholder={t("allModels")}
                searchPlaceholder={t("searchModels")}
              />
            </div>
          )}

          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              {t("clearFilters")}
            </button>
          )}

          <span className="ml-auto text-sm text-dark-5 dark:text-dark-6">
            {t("results", { count: data.totalElements })}
          </span>
        </div>
      </div>

      {/* Parts Grid */}
      {loading && data.content.length === 0 ? (
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
      ) : data.content.length === 0 ? (
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
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          title={t("noResults")}
          description={t("noResultsDescription")}
          action={
            hasFilters ? (
              <button
                onClick={handleClearFilters}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
              >
                {t("clearFilters")}
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.content.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                currencyOptions={currencyOptions}
              />
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={data.first}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
              >
                &larr;
              </button>
              <span className="px-4 text-sm text-dark-5 dark:text-dark-6">
                {data.pageNumber + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
              >
                &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
