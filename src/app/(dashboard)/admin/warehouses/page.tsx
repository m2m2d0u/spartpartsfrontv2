import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getWarehouses } from "@/services/warehouses.server";
import { getStores } from "@/services/stores.server";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { WarehousesTable } from "./_components/warehouses-table";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("warehouses");
  return { title: t("title") };
}

async function WarehousesData() {
  const [warehousesPage, storesPage] = await Promise.all([
    getWarehouses(0, 20),
    getStores(),
  ]);
  return (
    <WarehousesTable
      warehouses={warehousesPage.content}
      stores={storesPage.content}
      totalElements={warehousesPage.totalElements}
      initialPage={1}
    />
  );
}

export default async function WarehousesPage() {
  const t = await getTranslations("warehouses");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("warehouses") },
        ]}
        actions={
          <PermissionGate permission={Permission.WAREHOUSE_CREATE}>
            <Link
              href="/admin/warehouses/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addWarehouse")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={7} />}>
        <WarehousesData />
      </Suspense>
    </>
  );
}
