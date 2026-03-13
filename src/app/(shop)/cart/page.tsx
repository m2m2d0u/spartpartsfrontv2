import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartView } from "@/components/shop/cart-view";
import { getShopCompanySettings } from "@/services/shop.server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("shop");
  return { title: t("shoppingCart") };
}

export default async function CartPage() {
  let companySettings;

  try {
    companySettings = await getShopCompanySettings();
  } catch {
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

  return <CartView currencyOptions={currencyOptions} />;
}
