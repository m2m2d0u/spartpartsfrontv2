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
  const paged = await getParts(0, 20);
  return (
    <PartsTable
      parts={paged.content}
      totalElements={paged.totalElements}
      initialPage={1}
    />
  );
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
          <div className="flex items-center gap-2">
            <PermissionGate permission={Permission.PART_IMPORT}>
              <Link
                href="/admin/parts/import"
                className="inline-flex items-center gap-2 rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0"
                >
                  <path
                    d="M14 10v2.667A1.333 1.333 0 0112.667 14H3.333A1.333 1.333 0 012 12.667V10M4.667 6.667L8 10l3.333-3.333M8 10V2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("bulkImport")}
              </Link>
            </PermissionGate>
            <PermissionGate permission={Permission.PART_CREATE}>
              <Link
                href="/admin/parts/new"
                className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                {t("addPart")}
              </Link>
            </PermissionGate>
          </div>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={6} />}>
        <PartsData />
      </Suspense>
    </>
  );
}
