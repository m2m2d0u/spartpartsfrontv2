import type { Metadata } from "next";
import { CheckoutView } from "@/components/shop/checkout-view";
import { getShopStoreConfig } from "@/services/shop.server";

export const metadata: Metadata = {
  title: "Checkout | Spare Parts Store",
  description: "Complete your order.",
};

export default async function CheckoutPage() {
  let storeConfig;

  try {
    storeConfig = await getShopStoreConfig();
  } catch {
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

  return <CheckoutView currencyOptions={currencyOptions} />;
}
