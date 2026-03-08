import type { Metadata } from "next";
import type { PagedResponse } from "@/types";
import type { PortalPart, PortalCategory, PortalStoreConfig } from "@/types/portal";
import { getShopParts, getShopCategories, getShopStoreConfig } from "@/services/shop.server";
import { CatalogView } from "@/components/shop/catalog-view";

export const metadata: Metadata = {
  title: "Catalog | Spare Parts Store",
  description: "Browse our catalog of spare parts and accessories.",
};

const emptyPage: PagedResponse<PortalPart> = {
  content: [],
  pageNumber: 0,
  pageSize: 20,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

export default async function CatalogPage() {
  let initialData: PagedResponse<PortalPart>;
  let categories: PortalCategory[];
  let storeConfig: PortalStoreConfig | null;

  try {
    [initialData, categories, storeConfig] = await Promise.all([
      getShopParts(0, 20),
      getShopCategories(),
      getShopStoreConfig(),
    ]);
  } catch {
    initialData = emptyPage;
    categories = [];
    storeConfig = null;
  }

  const currencyOptions = storeConfig
    ? {
        symbol: storeConfig.currencySymbol,
        position: storeConfig.currencyPosition,
        decimals: storeConfig.currencyDecimals,
        thousandsSeparator: storeConfig.thousandsSeparator,
      }
    : undefined;

  return (
    <CatalogView
      initialData={initialData}
      categories={categories}
      currencyOptions={currencyOptions}
    />
  );
}
