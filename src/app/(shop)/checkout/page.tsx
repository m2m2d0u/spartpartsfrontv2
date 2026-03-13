import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutView } from "@/components/shop/checkout-view";
import { getShopCompanySettings } from "@/services/shop.server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("shop");
  return { title: t("checkout") };
}

export default async function CheckoutPage() {
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

  return <CheckoutView currencyOptions={currencyOptions} />;
}
