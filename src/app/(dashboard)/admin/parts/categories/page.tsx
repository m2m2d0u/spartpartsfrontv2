import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getCategories } from "@/services/categories.server";
import { CategoriesTable } from "./_components/categories-table";

export const metadata: Metadata = {
  title: "Categories",
};

async function CategoriesData() {
  const paged = await getCategories();
  return <CategoriesTable categories={paged.content} />;
}

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Parts", href: "/admin/parts" },
          { label: "Categories" },
        ]}
        actions={
          <Link
            href="/admin/parts/categories/new"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Add Category
          </Link>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={4} />}>
        <CategoriesData />
      </Suspense>
    </>
  );
}
