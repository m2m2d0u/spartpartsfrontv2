import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getUserStatusVariant,
  getUserRoleVariant,
} from "@/lib/status-variants";
import { getUserById } from "@/services/users.server";
import { WarehouseAssignments } from "../_components/warehouse-assignments";
import { StoreAssignments } from "../_components/store-assignments";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission, UserRoleCode } from "@/types";

export const metadata: Metadata = {
  title: "User Detail",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) notFound();

  const t = await getTranslations("users");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const showStores = user.roleCode === UserRoleCode.RESPONSABLE_MAGASIN;
  const showWarehouses =
    user.roleCode === UserRoleCode.OPERATEUR_ENTREPOT ||
    user.roleCode === UserRoleCode.RESPONSABLE_ENTREPOT;

  return (
    <>
      <PageHeader
        title={user.name}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("users"), href: "/admin/users" },
          { label: user.name },
        ]}
        actions={
          <PermissionGate permission={Permission.USER_UPDATE}>
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("editUser")}
            </Link>
          </PermissionGate>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* User info */}
        <div>
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {t("userInformation")}
              </h3>
              <StatusBadge variant={getUserStatusVariant(user.isActive)}>
                {user.isActive ? tCommon("active") : tCommon("inactive")}
              </StatusBadge>
            </div>

            <dl className="space-y-4">
              <div>
                <dt className="text-body-sm text-dark-6">{t("name")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {user.name}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("email")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("role")}</dt>
                <dd>
                  <StatusBadge variant={getUserRoleVariant(user.roleCode)}>
                    {user.roleDisplayName || user.roleCode}
                  </StatusBadge>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Assignments based on role */}
        <div className="space-y-6 xl:col-span-2">
          {showStores && (
            <StoreAssignments
              userId={user.id}
              assignments={user.stores || []}
            />
          )}

          {showWarehouses && (
            <WarehouseAssignments
              userId={user.id}
              assignments={user.warehouseAssignments || []}
            />
          )}

          {user.roleCode === UserRoleCode.ADMINISTRATEUR && (
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
              <p className="py-4 text-center text-body-sm text-dark-6">
                {t("adminFullAccess")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
