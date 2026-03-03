import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getStores } from "@/services/stores.service";
import { WarehouseForm } from "../_components/warehouse-form";

export const metadata: Metadata = {
  title: "New Warehouse",
};

type Props = {
  searchParams: Promise<{ storeId?: string }>;
};

export default async function NewWarehousePage({ searchParams }: Props) {
  const { storeId } = await searchParams;
  const stores = await getStores();

  return (
    <>
      <PageHeader
        title="New Warehouse"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Warehouses", href: "/admin/warehouses" },
          { label: "New Warehouse" },
        ]}
      />

      <WarehouseForm stores={stores} defaultStoreId={storeId} />
    </>
  );
}
