import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getCarBrands } from "@/services/car-brands.server";
import { CarBrandsTable } from "./_components/car-brands-table";

export const metadata: Metadata = {
  title: "Car Brands",
};

async function CarBrandsData() {
  const paged = await getCarBrands();
  return <CarBrandsTable carBrands={paged.content} />;
}

export default async function CarBrandsPage() {
  const t = await getTranslations("carBrands");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("carBrands") },
        ]}
        actions={
          <PermissionGate permission={Permission.PART_CREATE}>
            <Link
              href="/admin/parts/car-brands/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addCarBrand")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={4} />}>
        <CarBrandsData />
      </Suspense>
    </>
  );
}
