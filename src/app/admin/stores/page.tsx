import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getStores } from "@/services/stores.service";
import { StoresTable } from "./_components/stores-table";

export const metadata: Metadata = {
  title: "Stores",
};

async function StoresData() {
  const stores = await getStores();
  return <StoresTable stores={stores} />;
}

export default function StoresPage() {
  return (
    <>
      <PageHeader
        title="Stores"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Stores" },
        ]}
        actions={
          <Link
            href="/admin/stores/new"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Add Store
          </Link>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={6} />}>
        <StoresData />
      </Suspense>
    </>
  );
}
