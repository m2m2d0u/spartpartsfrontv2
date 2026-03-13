import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getPurchaseOrders } from "@/services/purchase-orders.server";
import { getCompanySettings } from "@/services/company-settings.server";
import { PurchaseOrdersTable } from "./_components/purchase-orders-table";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("purchaseOrders");
  return { title: t("title") };
}

async function PurchaseOrdersData() {
  const [page, settings] = await Promise.all([
    getPurchaseOrders(0, 20),
    getCompanySettings(),
  ]);
  return (
    <PurchaseOrdersTable
      purchaseOrders={page.content}
      totalElements={page.totalElements}
      initialPage={1}
      currencyOptions={{
        symbol: settings.currencySymbol,
        position: settings.currencyPosition,
        decimals: settings.currencyDecimals,
        thousandsSeparator: settings.thousandsSeparator,
      }}
    />
  );
}

export default async function PurchaseOrdersPage() {
  const t = await getTranslations("purchaseOrders");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("procurement") },
          { label: tNav("purchaseOrders") },
        ]}
        actions={
          <PermissionGate permission={Permission.PROCUREMENT_CREATE}>
            <Link
              href="/admin/purchase-orders/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("createPurchaseOrder")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={7} />}>
        <PurchaseOrdersData />
      </Suspense>
    </>
  );
}
