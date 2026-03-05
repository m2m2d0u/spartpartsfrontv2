import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getSuppliers } from "@/services/suppliers.server";
import { SuppliersTable } from "./_components/suppliers-table";

export const metadata: Metadata = {
  title: "Suppliers",
};

async function SuppliersData() {
  const page = await getSuppliers(0, 20);
  return <SuppliersTable suppliers={page.content} totalElements={page.totalElements} initialPage={1} />;
}

export default async function SuppliersPage() {
  const t = await getTranslations("suppliers");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("procurement") },
          { label: tNav("suppliers") },
        ]}
        actions={
          <PermissionGate permission={Permission.PROCUREMENT_CREATE}>
            <Link
              href="/admin/suppliers/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addSupplier")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={6} />}>
        <SuppliersData />
      </Suspense>
    </>
  );
}
