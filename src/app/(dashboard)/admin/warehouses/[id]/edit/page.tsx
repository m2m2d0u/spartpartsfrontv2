import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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

  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${warehouse.name}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("warehouses"), href: "/admin/warehouses" },
          {
            label: warehouse.name,
            href: `/admin/warehouses/${warehouse.id}`,
          },
          { label: tCommon("edit") },
        ]}
      />

      <WarehouseForm warehouse={warehouse} stores={storesPage.content} />
    </>
  );
}
