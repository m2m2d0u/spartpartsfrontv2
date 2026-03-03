import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getStockMovements } from "@/services/stock-movements.server";
import { getWarehouses } from "@/services/warehouses.server";
import { StockMovementsTable } from "./_components/stock-movements-table";

export const metadata: Metadata = {
  title: "Stock Movements",
};

export default async function StockMovementsPage() {
  const [movementsPage, warehousesPage] = await Promise.all([
    getStockMovements(),
    getWarehouses(0, 200, true),
  ]);

  const t = await getTranslations("stockMovements");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stock") },
          { label: tNav("stockMovements") },
        ]}
      />

      <StockMovementsTable
        movements={movementsPage.content}
        warehouses={warehousesPage.content}
      />
    </>
  );
}
