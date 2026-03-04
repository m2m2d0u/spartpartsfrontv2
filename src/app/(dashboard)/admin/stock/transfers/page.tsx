import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getStockTransfers } from "@/services/stock-transfers.server";
import { StockTransfersTable } from "./_components/stock-transfers-table";

export const metadata: Metadata = {
  title: "Stock Transfers",
};

async function TransfersData() {
  const transfersPage = await getStockTransfers();
  return <StockTransfersTable transfers={transfersPage.content} />;
}

export default async function StockTransfersPage() {
  const t = await getTranslations("stockTransfers");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stock") },
          { label: tNav("stockTransfers") },
        ]}
        actions={
          <PermissionGate permission={Permission.TRANSFER_CREATE}>
            <Link
              href="/admin/stock/transfers/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addTransfer")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={6} />}>
        <TransfersData />
      </Suspense>
    </>
  );
}
