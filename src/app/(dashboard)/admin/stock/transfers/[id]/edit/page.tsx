import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getStockTransferById } from "@/services/stock-transfers.server";
import { getWarehouses } from "@/services/warehouses.server";
import { getParts } from "@/services/parts.server";
import { StockTransferForm } from "../../_components/stock-transfer-form";

export const metadata: Metadata = {
  title: "Edit Stock Transfer",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditStockTransferPage({ params }: Props) {
  const { id } = await params;
  const [transfer, warehousesPage, partsPage] = await Promise.all([
    getStockTransferById(id).catch(() => null),
    getWarehouses(0, 200, true),
    getParts(0, 500),
  ]);

  if (!transfer || transfer.status !== "PENDING") notFound();

  const t = await getTranslations("stockTransfers");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const partOptions = partsPage.content.map((p) => ({
    id: p.id,
    name: p.name,
    partNumber: p.partNumber,
  }));

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
        warehouses={warehousesPage.content}
        parts={partOptions}
        transfer={transfer}
      />
    </>
  );
}
