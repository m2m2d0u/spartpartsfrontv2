import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getSuppliers } from "@/services/suppliers.server";
import { getWarehouses } from "@/services/warehouses.server";
import { getCompanySettings } from "@/services/company-settings.server";
import { PurchaseOrderForm } from "../_components/purchase-order-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("purchaseOrders");
  return { title: t("newOrder") };
}

export default async function NewPurchaseOrderPage() {
  const [t, tNav, suppliersPage, warehousesPage, settings] = await Promise.all([
    getTranslations("purchaseOrders"),
    getTranslations("nav"),
    getSuppliers(0, 200),
    getWarehouses(0, 200),
    getCompanySettings(),
  ]);

  return (
    <>
      <PageHeader
        title={t("newOrder")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("procurement") },
          { label: tNav("purchaseOrders"), href: "/admin/purchase-orders" },
          { label: t("newOrder") },
        ]}
      />

      <PurchaseOrderForm
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
