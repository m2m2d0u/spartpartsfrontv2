import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getTags } from "@/services/tags.server";
import { TagsTable } from "./_components/tags-table";

export const metadata: Metadata = {
  title: "Tags",
};

async function TagsData() {
  const paged = await getTags();
  return <TagsTable tags={paged.content} />;
}

export default async function TagsPage() {
  const t = await getTranslations("tags");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("tags") },
        ]}
        actions={
          <PermissionGate permission={Permission.PART_CREATE}>
            <Link
              href="/admin/parts/tags/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addTag")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={3} />}>
        <TagsData />
      </Suspense>
    </>
  );
}
