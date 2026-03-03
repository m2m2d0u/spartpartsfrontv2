import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getWarehouses } from "@/services/warehouses.server";
import { getStores } from "@/services/stores.server";
import { WarehousesTable } from "./_components/warehouses-table";

export const metadata: Metadata = {
  title: "Warehouses",
};

async function WarehousesData() {
  const [warehousesPage, storesPage] = await Promise.all([
    getWarehouses(),
    getStores(),
  ]);
  return (
    <WarehousesTable
      warehouses={warehousesPage.content}
      stores={storesPage.content}
    />
  );
}

export default function WarehousesPage() {
  return (
    <>
      <PageHeader
        title="Warehouses"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Warehouses" },
        ]}
        actions={
          <Link
            href="/admin/warehouses/new"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Add Warehouse
          </Link>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={7} />}>
        <WarehousesData />
      </Suspense>
    </>
  );
}
