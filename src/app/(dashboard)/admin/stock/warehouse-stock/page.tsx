import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getWarehouses } from "@/services/warehouses.server";
import { getStores } from "@/services/stores.server";
import { WarehouseStockTable } from "./_components/warehouse-stock-table";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("warehouseStock");
  return { title: t("title") };
}

export default async function WarehouseStockPage() {
  const [warehousesPage, storesPage] = await Promise.all([
    getWarehouses(0, 200, true),
    getStores(0, 200, true),
  ]);

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

      <WarehouseStockTable
        warehouses={warehousesPage.content}
        stores={storesPage.content}
      />
    </>
  );
}
