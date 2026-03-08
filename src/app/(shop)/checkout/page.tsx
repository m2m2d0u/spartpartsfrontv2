import type { Metadata } from "next";
import { CheckoutView } from "@/components/shop/checkout-view";
import { getShopCompanySettings } from "@/services/shop.server";

export const metadata: Metadata = {
  title: "Checkout | Spare Parts Store",
  description: "Complete your order.",
};

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
