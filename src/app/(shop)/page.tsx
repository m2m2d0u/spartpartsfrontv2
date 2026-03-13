import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { PortalPart, PortalCategory, PortalCompanySettings } from "@/types/portal";
import { getShopParts, getShopCategories, getShopCompanySettings } from "@/services/shop.server";
import { HomepageView } from "@/components/shop/homepage-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("shop");
  return { title: t("storeName") };
}

export default async function HomePage() {
  let categories: PortalCategory[] = [];
  let featuredParts: PortalPart[] = [];
  let companySettings: PortalCompanySettings | null = null;

  try {
    const [partsResult, categoriesResult, settingsResult] = await Promise.all([
      getShopParts(0, 8),
      getShopCategories(),
      getShopCompanySettings(),
    ]);
    featuredParts = partsResult.content;
    categories = categoriesResult;
    companySettings = settingsResult;
  } catch {
    // Backend not ready — show page with empty data
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
    <HomepageView
      categories={categories}
      featuredParts={featuredParts}
      currencyOptions={currencyOptions}
    />
  );
}
