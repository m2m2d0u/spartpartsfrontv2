import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getRoles } from "@/services/roles.server";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { RolesTable } from "./_components/roles-table";

export const metadata: Metadata = {
  title: "Roles",
};

async function RolesData() {
  const rolesPage = await getRoles(0, 200);
  return <RolesTable roles={rolesPage.content} />;
}

export default async function RolesPage() {
  const t = await getTranslations("roles");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("roles") },
        ]}
        actions={
          <PermissionGate permission={Permission.ROLE_CREATE}>
            <Link
              href="/admin/roles/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("createRole")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={5} />}>
        <RolesData />
      </Suspense>
    </>
  );
}
