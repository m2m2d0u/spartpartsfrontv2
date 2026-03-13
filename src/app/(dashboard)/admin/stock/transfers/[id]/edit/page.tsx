import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getStockTransferById } from "@/services/stock-transfers.server";
import { getWarehouseById } from "@/services/warehouses.server";
import { StockTransferForm } from "../../_components/stock-transfer-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("stockTransfers");
  return { title: t("editTransfer") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditStockTransferPage({ params }: Props) {
  const { id } = await params;
  const transfer = await getStockTransferById(id).catch(() => null);

  if (!transfer || transfer.status !== "PENDING") notFound();

  // Fetch the warehouses used in this transfer so selects display labels
  const warehouseIds = [
    ...new Set([transfer.sourceWarehouseId, transfer.destinationWarehouseId]),
  ];
  const initialWarehouses = await Promise.all(
    warehouseIds.map((whId) => getWarehouseById(whId)),
  );

  const t = await getTranslations("stockTransfers");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${transfer.transferNumber}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stock") },
          { label: tNav("stockTransfers"), href: "/admin/stock/transfers" },
          {
            label: transfer.transferNumber,
            href: `/admin/stock/transfers/${transfer.id}`,
          },
          { label: tCommon("edit") },
        ]}
      />

      <StockTransferForm
        transfer={transfer}
        initialWarehouses={initialWarehouses}
      />
    </>
  );
}
