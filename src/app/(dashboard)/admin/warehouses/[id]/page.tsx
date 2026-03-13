import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWarehouseStatusVariant } from "@/lib/status-variants";
import {
  getWarehouseById,
  getWarehouseUsers,
} from "@/services/warehouses.server";
import { PermissionGate } from "@/components/PermissionGate";
import { UserAssignments } from "@/components/user-assignments";
import { Permission } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("warehouses");
  return { title: t("title") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WarehouseDetailPage({ params }: Props) {
  const { id } = await params;
  const [warehouse, warehouseUsers] = await Promise.all([
    getWarehouseById(id),
    getWarehouseUsers(id).catch(() => []),
  ]);

  if (!warehouse) notFound();

  const fullAddress = [
    warehouse.street,
    warehouse.city,
    warehouse.state,
    warehouse.postalCode,
    warehouse.country,
  ]
    .filter(Boolean)
    .join(", ");

  const t = await getTranslations("warehouses");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={warehouse.name}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("warehouses"), href: "/admin/warehouses" },
          { label: warehouse.name },
        ]}
        actions={
          <PermissionGate permission={Permission.WAREHOUSE_UPDATE}>
            <Link
              href={`/admin/warehouses/${warehouse.id}/edit`}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("editWarehouse")}
            </Link>
          </PermissionGate>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main info */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {t("warehouseInformation")}
              </h3>
              <StatusBadge
                variant={getWarehouseStatusVariant(warehouse.isActive)}
              >
                {warehouse.isActive ? tCommon("active") : tCommon("inactive")}
              </StatusBadge>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-body-sm text-dark-6">{t("code")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.code}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("store")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  <Link
                    href={`/admin/stores/${warehouse.storeId}`}
                    className="text-primary hover:underline"
                  >
                    {warehouse.storeName}
                  </Link>
                </dd>
              </div>
              {warehouse.location && (
                <div>
                  <dt className="text-body-sm text-dark-6">{t("location")}</dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {warehouse.location}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-body-sm text-dark-6">{tCommon("city")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.city}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{tCommon("phone")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.phone}
                </dd>
              </div>
              {fullAddress && (
                <div className="sm:col-span-2">
                  <dt className="text-body-sm text-dark-6">{tCommon("address")}</dt>
                  <dd className="font-medium text-dark dark:text-white">
                    {fullAddress}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-body-sm text-dark-6">{t("contactPerson")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouse.contactPerson}
                </dd>
              </div>
            </dl>

            {warehouse.notes && (
              <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
                <dt className="text-body-sm text-dark-6">{t("notes")}</dt>
                <dd className="mt-1 text-sm text-dark dark:text-white">
                  {warehouse.notes}
                </dd>
              </div>
            )}
          </div>
        </div>

        {/* Stock summary placeholder */}
        <div className="space-y-6">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {t("stockSummary")}
            </h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">{t("totalParts")}</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">{t("lowStockItems")}</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">{t("stockValue")}</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
            </dl>
          </div>

          {/* Assigned users */}
          <UserAssignments
            entityId={warehouse.id}
            entityType="warehouse"
            assignedUsers={warehouseUsers}
            assignPermission={Permission.WAREHOUSE_UPDATE}
            unassignPermission={Permission.WAREHOUSE_UPDATE}
          />
        </div>
      </div>
    </>
  );
}
