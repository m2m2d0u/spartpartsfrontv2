import type { Metadata } from "next";
import type { PortalPart, PortalCategory, PortalStoreConfig } from "@/types/portal";
import { getShopParts, getShopCategories, getShopStoreConfig } from "@/services/shop.server";
import { HomepageView } from "@/components/shop/homepage-view";

export const metadata: Metadata = {
  title: "Spare Parts Store",
  description:
    "Quality spare parts for every vehicle. Browse our catalog of genuine and aftermarket parts with fast delivery and competitive prices.",
};

export default async function HomePage() {
  let categories: PortalCategory[] = [];
  let featuredParts: PortalPart[] = [];
  let storeConfig: PortalStoreConfig | null = null;

  try {
    const [partsResult, categoriesResult, configResult] = await Promise.all([
      getShopParts(0, 8),
      getShopCategories(),
      getShopStoreConfig(),
    ]);
    featuredParts = partsResult.content;
    categories = categoriesResult;
    storeConfig = configResult;
  } catch {
    // Backend not ready — show page with empty data
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
    <HomepageView
      categories={categories}
      featuredParts={featuredParts}
      currencyOptions={currencyOptions}
    />
  );
}
