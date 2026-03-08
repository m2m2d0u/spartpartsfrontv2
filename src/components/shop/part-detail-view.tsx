"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PortalPartDetail } from "@/types/portal";
import type { CurrencyFormatOptions } from "@/lib/format-number";
import { formatCurrency } from "@/lib/format-number";
import { useCart } from "@/context/cart-context";
import { ImageGallery } from "./image-gallery";
import { QuantitySelector } from "./quantity-selector";
import { StockBadge } from "./stock-badge";

type PartDetailViewProps = {
  part: PortalPartDetail;
  currencyOptions?: CurrencyFormatOptions;
};

export function PartDetailView({ part, currencyOptions }: PartDetailViewProps) {
  const t = useTranslations("shop");
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = part.availableStock <= 0;

  function handleAddToCart() {
    addItem(
      {
        partId: part.id,
        partNumber: part.partNumber,
        name: part.name,
        unitPrice: part.sellingPrice,
        imageUrl: part.images.find((img) => img.isMain)?.url ?? part.images[0]?.url ?? null,
        maxStock: part.availableStock,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left: Image gallery */}
      <ImageGallery images={part.images} alt={part.name} />

      {/* Right: Info */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <p className="mb-1 text-sm text-dark-5 dark:text-dark-6">
            {t("partNumber", { number: part.partNumber })}
          </p>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            {part.name}
          </h1>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(part.sellingPrice, currencyOptions)}
          </span>
          <StockBadge totalStock={part.availableStock} />
        </div>

        {/* Stock units */}
        {part.availableStock > 0 && (
          <p className="text-sm text-dark-5 dark:text-dark-6">
            {t("units", { count: part.availableStock })}
          </p>
        )}

        {/* Meta */}
        <div className="space-y-2 rounded-lg border border-stroke p-4 dark:border-dark-3">
          {part.categoryName && (
            <div className="flex justify-between text-sm">
              <span className="text-dark-5 dark:text-dark-6">
                {t("category")}
              </span>
              <span className="font-medium text-dark dark:text-white">
                {part.categoryName}
              </span>
            </div>
          )}
          {part.carBrandName && (
            <div className="flex justify-between text-sm">
              <span className="text-dark-5 dark:text-dark-6">
                {t("brand")}
              </span>
              <span className="font-medium text-dark dark:text-white">
                {part.carBrandName}
              </span>
            </div>
          )}
          {part.carModelName && (
            <div className="flex justify-between text-sm">
              <span className="text-dark-5 dark:text-dark-6">
                {t("model")}
              </span>
              <span className="font-medium text-dark dark:text-white">
                {part.carModelName}
              </span>
            </div>
          )}
          {part.tags.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-dark-5 dark:text-dark-6">
                {t("tags")}
              </span>
              <div className="flex flex-wrap justify-end gap-1">
                {part.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-md bg-gray-2 px-2 py-0.5 text-xs text-dark-5 dark:bg-dark-3 dark:text-dark-6"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add to cart */}
        {!isOutOfStock && (
          <div className="flex items-center gap-4">
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={part.availableStock}
            />
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {added ? t("addedToCart") : t("addToCart")}
            </button>
          </div>
        )}

        {/* Description */}
        {(part.shortDescription || part.description) && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-dark dark:text-white">
              {t("description")}
            </h2>
            {part.shortDescription && (
              <p className="text-sm text-dark-5 dark:text-dark-6">
                {part.shortDescription}
              </p>
            )}
            {part.description && (
              <div className="prose prose-sm max-w-none text-dark-5 dark:text-dark-6">
                {part.description}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
