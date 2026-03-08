import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopOrder, getShopCompanySettings } from "@/services/shop.server";
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
  let companySettings;

  try {
    [order, companySettings] = await Promise.all([
      getShopOrder(orderNumber),
      getShopCompanySettings(),
    ]);
  } catch {
    notFound();
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
    <OrderConfirmationView
      order={order}
      currencyOptions={currencyOptions}
    />
  );
}
