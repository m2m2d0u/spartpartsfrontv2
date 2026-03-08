import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart-view";
import { getShopCompanySettings } from "@/services/shop.server";

export const metadata: Metadata = {
  title: "Cart | Spare Parts Store",
  description: "Review your shopping cart.",
};

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
