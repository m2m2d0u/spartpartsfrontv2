import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getStores } from "@/services/stores.server";
import { WarehouseForm } from "../_components/warehouse-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("warehouses");
  return { title: t("newWarehouse") };
}

type Props = {
  searchParams: Promise<{ storeId?: string }>;
};

export default async function NewWarehousePage({ searchParams }: Props) {
  const { storeId } = await searchParams;
  const storesPage = await getStores();
  const t = await getTranslations("warehouses");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newWarehouse")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("warehouses"), href: "/admin/warehouses" },
          { label: t("newWarehouse") },
        ]}
      />

      <WarehouseForm stores={storesPage.content} defaultStoreId={storeId} />
    </>
  );
}
