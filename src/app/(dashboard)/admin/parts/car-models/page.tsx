import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getCarModels } from "@/services/car-models.server";
import { getCarBrands } from "@/services/car-brands.server";
import { CarModelsTable } from "./_components/car-models-table";

export const metadata: Metadata = {
  title: "Car Models",
};

async function CarModelsData() {
  const [modelsPaged, brandsPaged] = await Promise.all([
    getCarModels(),
    getCarBrands(),
  ]);
  return (
    <CarModelsTable
      carModels={modelsPaged.content}
      brands={brandsPaged.content}
    />
  );
}

export default async function CarModelsPage() {
  const t = await getTranslations("carModels");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("carModels") },
        ]}
        actions={
          <Link
            href="/admin/parts/car-models/new"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            {t("addCarModel")}
          </Link>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={5} />}>
        <CarModelsData />
      </Suspense>
    </>
  );
}
