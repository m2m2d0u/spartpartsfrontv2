import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getCategories } from "@/services/categories.server";
import { CategoriesTable } from "./_components/categories-table";

export const metadata: Metadata = {
  title: "Categories",
};

async function CategoriesData() {
  const paged = await getCategories(0, 20);
  return <CategoriesTable categories={paged.content} totalElements={paged.totalElements} initialPage={1} />;
}

export default async function CategoriesPage() {
  const t = await getTranslations("categories");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("categories") },
        ]}
        actions={
          <PermissionGate permission={Permission.PART_CREATE}>
            <Link
              href="/admin/parts/categories/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addCategory")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={4} />}>
        <CategoriesData />
      </Suspense>
    </>
  );
}
