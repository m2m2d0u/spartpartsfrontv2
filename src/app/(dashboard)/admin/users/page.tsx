import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getUsers } from "@/services/users.server";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { UsersTable } from "./_components/users-table";

export const metadata: Metadata = {
  title: "Users",
};

async function UsersData() {
  const usersPage = await getUsers(0, 20);
  return <UsersTable users={usersPage.content} totalElements={usersPage.totalElements} initialPage={1} />;
}

export default async function UsersPage() {
  const t = await getTranslations("users");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("users") },
        ]}
        actions={
          <PermissionGate permission={Permission.USER_CREATE}>
            <Link
              href="/admin/users/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addUser")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={5} />}>
        <UsersData />
      </Suspense>
    </>
  );
}
