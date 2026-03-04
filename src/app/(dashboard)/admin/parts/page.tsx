import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getParts } from "@/services/parts.server";
import { PartsTable } from "./_components/parts-table";

export const metadata: Metadata = {
  title: "Parts",
};

async function PartsData() {
  const paged = await getParts();
  return <PartsTable parts={paged.content} />;
}

export default async function PartsPage() {
  const t = await getTranslations("parts");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts") },
        ]}
        actions={
          <PermissionGate permission={Permission.PART_CREATE}>
            <Link
              href="/admin/parts/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addPart")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={6} />}>
        <PartsData />
      </Suspense>
    </>
  );
}
