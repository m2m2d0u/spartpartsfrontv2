import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStoreStatusVariant } from "@/lib/status-variants";
import {
  getStoreById,
  getStoreUsers,
  getStoreLogoServer,
  getStoreStampServer,
} from "@/services/stores.server";
import { getWarehousesByStore } from "@/services/warehouses.server";
import { PermissionGate } from "@/components/PermissionGate";
import { UserAssignments } from "@/components/user-assignments";
import { Permission } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("stores");
  return { title: t("title") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoreDetailPage({ params }: Props) {
  const { id } = await params;
  const [store, warehousesPage, storeUsers] = await Promise.all([
    getStoreById(id),
    getWarehousesByStore(id),
    getStoreUsers(id).catch(() => []),
  ]);

  if (!store) notFound();

  const warehouses = warehousesPage.content;

  // Fetch images as base64 in parallel (only if URLs exist)
  const [logoData, stampData] = await Promise.all([
    store.logoUrl ? getStoreLogoServer(id).catch(() => null) : null,
    store.stampImageUrl ? getStoreStampServer(id).catch(() => null) : null,
  ]);

  const t = await getTranslations("stores");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tStoreOverrides = await getTranslations("storeOverrides");

  return (
    <>
      <PageHeader
        title={store.name}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stores"), href: "/admin/stores" },
          { label: store.name },
        ]}
        actions={
          <PermissionGate permission={Permission.STORE_UPDATE}>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/stores/${store.id}/settings`}
                className="rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                {t("storeSettings")}
              </Link>
              <Link
                href={`/admin/stores/${store.id}/edit`}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                {t("editStore")}
              </Link>
            </div>
          </PermissionGate>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Store Info */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {t("storeInformation")}
              </h3>
              <StatusBadge variant={getStoreStatusVariant(store.isActive)}>
                {store.isActive ? tCommon("active") : tCommon("inactive")}
              </StatusBadge>
            </div>

            {/* Logo & Stamp */}
            {(logoData?.base64 || stampData?.base64) && (
              <div className="mb-5 flex flex-wrap items-start gap-6 border-b border-stroke pb-5 dark:border-dark-3">
                {logoData?.base64 && (
                  <div>
                    <p className="mb-2 text-body-sm text-dark-6">
                      {t("logo")}
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${logoData.base64}`}
                      alt={t("logo")}
                      className="h-24 w-auto rounded-lg border border-stroke object-contain p-1 dark:border-dark-3"
                    />
                  </div>
                )}
                {stampData?.base64 && (
                  <div>
                    <p className="mb-2 text-body-sm text-dark-6">
                      {t("stamp")}
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${stampData.base64}`}
                      alt={t("stamp")}
                      className="h-24 w-auto rounded-lg border border-stroke object-contain p-1 dark:border-dark-3"
                    />
                  </div>
                )}
              </div>
            )}

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-body-sm text-dark-6">{t("code")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.code}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{tCommon("email")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.email}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{tCommon("phone")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.phone}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{tCommon("city")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.city}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-body-sm text-dark-6">{tCommon("address")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {store.street}, {store.city},{" "}
                  {store.state} {store.postalCode},{" "}
                  {store.country}
                </dd>
              </div>
            </dl>

            {/* Override indicators */}
            {(store.ninea || store.rccm || store.taxId) && (
              <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
                <h4 className="mb-3 text-body-sm font-medium text-dark dark:text-white">
                  {t("customOverrides")}
                </h4>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {store.ninea && (
                    <div>
                      <dt className="text-body-sm text-dark-6">NINEA</dt>
                      <dd className="text-sm text-dark dark:text-white">
                        {store.ninea}
                      </dd>
                    </div>
                  )}
                  {store.rccm && (
                    <div>
                      <dt className="text-body-sm text-dark-6">RCCM</dt>
                      <dd className="text-sm text-dark dark:text-white">
                        {store.rccm}
                      </dd>
                    </div>
                  )}
                  {store.taxId && (
                    <div>
                      <dt className="text-body-sm text-dark-6">
                        {tStoreOverrides("taxId")}
                      </dt>
                      <dd className="text-sm text-dark dark:text-white">
                        {store.taxId}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="space-y-6">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {t("summary")}
            </h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">{tNav("warehouses")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {warehouses.length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">{t("totalCustomers")}</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-body-sm text-dark-6">{t("monthlyRevenue")}</dt>
                <dd className="font-medium text-dark dark:text-white">—</dd>
              </div>
            </dl>
          </div>

          {/* Warehouses list */}
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {tNav("warehouses")}
              </h3>
              <PermissionGate permission={Permission.WAREHOUSE_CREATE}>
                <Link
                  href={`/admin/warehouses/new?storeId=${store.id}`}
                  className="text-body-sm text-primary hover:underline"
                >
                  {tCommon("add")}
                </Link>
              </PermissionGate>
            </div>
            {warehouses.length === 0 ? (
              <p className="text-body-sm text-dark-6">
                {t("noWarehousesAssigned")}
              </p>
            ) : (
              <ul className="space-y-2">
                {warehouses.map((wh) => (
                  <li key={wh.id}>
                    <Link
                      href={`/admin/warehouses/${wh.id}`}
                      className="flex items-center justify-between rounded-lg border border-stroke px-4 py-3 transition hover:bg-gray-2 dark:border-dark-3 dark:hover:bg-dark-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {wh.name}
                        </p>
                        <p className="text-xs text-dark-6">
                          {wh.code} — {wh.city}
                        </p>
                      </div>
                      <StatusBadge
                        variant={wh.isActive ? "success" : "neutral"}
                      >
                        {wh.isActive ? tCommon("active") : tCommon("inactive")}
                      </StatusBadge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Assigned users */}
          <UserAssignments
            entityId={store.id}
            entityType="store"
            assignedUsers={storeUsers}
            assignPermission={Permission.STORE_UPDATE}
            unassignPermission={Permission.STORE_UPDATE}
          />
        </div>
      </div>
    </>
  );
}
