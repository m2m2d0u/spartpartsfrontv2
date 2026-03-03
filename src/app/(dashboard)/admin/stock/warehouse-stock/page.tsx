import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getWarehouses } from "@/services/warehouses.server";
import { getParts } from "@/services/parts.server";
import { WarehouseStockTable } from "./_components/warehouse-stock-table";

export const metadata: Metadata = {
  title: "Warehouse Stock",
};

export default async function WarehouseStockPage() {
  const [warehousesPage, partsPage] = await Promise.all([
    getWarehouses(0, 200, true),
    getParts(0, 500),
  ]);

  const t = await getTranslations("warehouseStock");
  const tNav = await getTranslations("nav");

  const partOptions = partsPage.content.map((p) => ({
    id: p.id,
    name: p.name,
    partNumber: p.partNumber,
  }));

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

      <WarehouseStockTable warehouses={warehousesPage.content} parts={partOptions} />
    </>
  );
}
