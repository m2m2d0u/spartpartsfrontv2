import type { Metadata } from "next";
import type { PagedResponse } from "@/types";
import type { PortalPart, PortalCategory, PortalCompanySettings } from "@/types/portal";
import { getShopParts, getShopCategories, getShopCompanySettings } from "@/services/shop.server";
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
  let companySettings: PortalCompanySettings | null;

  try {
    [initialData, categories, companySettings] = await Promise.all([
      getShopParts(0, 20),
      getShopCategories(),
      getShopCompanySettings(),
    ]);
  } catch {
    initialData = emptyPage;
    categories = [];
    companySettings = null;
  }

  const currencyOptions = companySettings
    ? {
        symbol: companySettings.currencySymbol,
        position: companySettings.currencyPosition,
        decimals: companySettings.currencyDecimals,
        thousandsSeparator: companySettings.thousandsSeparator,
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
