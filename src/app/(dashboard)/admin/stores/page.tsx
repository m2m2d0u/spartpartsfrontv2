import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getStores } from "@/services/stores.server";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { StoresTable } from "./_components/stores-table";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("stores");
  return { title: t("title") };
}

async function StoresData() {
  const pagedStores = await getStores(0, 20);
  return <StoresTable stores={pagedStores.content} totalElements={pagedStores.totalElements} initialPage={1} />;
}

export default async function StoresPage() {
  const t = await getTranslations("stores");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stores") },
        ]}
        actions={
          <PermissionGate permission={Permission.STORE_CREATE}>
            <Link
              href="/admin/stores/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addStore")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={6} />}>
        <StoresData />
      </Suspense>
    </>
  );
}
