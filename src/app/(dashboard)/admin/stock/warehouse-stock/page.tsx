import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getWarehouses } from "@/services/warehouses.server";
import { WarehouseStockTable } from "./_components/warehouse-stock-table";

export const metadata: Metadata = {
  title: "Warehouse Stock",
};

export default async function WarehouseStockPage() {
  const warehousesPage = await getWarehouses(0, 200, true);

  const t = await getTranslations("warehouseStock");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stock") },
          { label: tNav("warehouseStock") },
        ]}
      />

      <WarehouseStockTable warehouses={warehousesPage.content} />
    </>
  );
}
