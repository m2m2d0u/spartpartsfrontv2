import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopOrder, getShopStoreConfig } from "@/services/shop.server";
import { OrderConfirmationView } from "@/components/shop/order-confirmation-view";

type Props = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order #${orderNumber} | Spare Parts Store`,
    description: "Order confirmation details.",
  };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;

  let order;
  let storeConfig;

  try {
    [order, storeConfig] = await Promise.all([
      getShopOrder(orderNumber),
      getShopStoreConfig(),
    ]);
  } catch {
    notFound();
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
    <OrderConfirmationView
      order={order}
      currencyOptions={currencyOptions}
    />
  );
}
