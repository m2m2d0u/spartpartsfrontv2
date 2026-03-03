import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getWarehouses } from "@/services/warehouses.service";
import { getStores } from "@/services/stores.service";
import { WarehousesTable } from "./_components/warehouses-table";

export const metadata: Metadata = {
  title: "Warehouses",
};

async function WarehousesData() {
  const [warehouses, stores] = await Promise.all([
    getWarehouses(),
    getStores(),
  ]);
  return <WarehousesTable warehouses={warehouses} stores={stores} />;
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
