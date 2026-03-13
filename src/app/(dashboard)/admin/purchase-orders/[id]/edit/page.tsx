import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PurchaseOrderStatusCode } from "@/types";
import { getPurchaseOrderById } from "@/services/purchase-orders.server";
import { getSuppliers } from "@/services/suppliers.server";
import { getWarehouses } from "@/services/warehouses.server";
import { getCompanySettings } from "@/services/company-settings.server";
import { PurchaseOrderForm } from "../../_components/purchase-order-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("purchaseOrders");
  return { title: t("title") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPurchaseOrderPage({ params }: Props) {
  const { id } = await params;
  const [po, suppliersPage, warehousesPage, settings] = await Promise.all([
    getPurchaseOrderById(id).catch(() => null),
    getSuppliers(0, 200),
    getWarehouses(0, 200),
    getCompanySettings(),
  ]);

  if (!po || po.status !== PurchaseOrderStatusCode.DRAFT) notFound();

  const t = await getTranslations("purchaseOrders");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${po.poNumber}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("procurement") },
          { label: tNav("purchaseOrders"), href: "/admin/purchase-orders" },
          { label: po.poNumber, href: `/admin/purchase-orders/${po.id}` },
          { label: tCommon("edit") },
        ]}
      />

      <PurchaseOrderForm
        purchaseOrder={po}
        suppliers={suppliersPage.content}
        warehouses={warehousesPage.content}
        currencyOptions={{
          symbol: settings.currencySymbol,
          position: settings.currencyPosition,
          decimals: settings.currencyDecimals,
          thousandsSeparator: settings.thousandsSeparator,
        }}
      />
    </>
  );
}
