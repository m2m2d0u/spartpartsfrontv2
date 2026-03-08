import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart-view";
import { getShopStoreConfig } from "@/services/shop.server";

export const metadata: Metadata = {
  title: "Cart | Spare Parts Store",
  description: "Review your shopping cart.",
};

export default async function CartPage() {
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

  return <CartView currencyOptions={currencyOptions} />;
}
