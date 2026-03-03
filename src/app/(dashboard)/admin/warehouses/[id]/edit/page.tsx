import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getWarehouseById } from "@/services/warehouses.server";
import { getStores } from "@/services/stores.server";
import { WarehouseForm } from "../../_components/warehouse-form";

export const metadata: Metadata = {
  title: "Edit Warehouse",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditWarehousePage({ params }: Props) {
  const { id } = await params;
  const [warehouse, storesPage] = await Promise.all([
    getWarehouseById(id),
    getStores(),
  ]);

  if (!warehouse) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — ${warehouse.name}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Warehouses", href: "/admin/warehouses" },
          {
            label: warehouse.name,
            href: `/admin/warehouses/${warehouse.id}`,
          },
          { label: "Edit" },
        ]}
      />

      <WarehouseForm warehouse={warehouse} stores={storesPage.content} />
    </>
  );
}
