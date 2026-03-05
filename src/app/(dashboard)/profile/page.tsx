"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { getTokenPermissions } from "@/services/auth.service";
import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/PageHeader";
import type { Store, Warehouse } from "@/types";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const t = useTranslations("profile");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const [stores, setStores] = useState<Store[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const { apiGet } = await import("@/services/api-client");
        const [storesData, warehousesData] = await Promise.all([
          apiGet<Store[]>("/stores/my"),
          apiGet<Warehouse[]>("/warehouses/my"),
        ]);
        if (!cancelled) {
          setStores(storesData);
          setWarehouses(warehousesData);
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoadingResources(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-dark-6">
        {t("notAuthenticated")}
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: t("title") },
        ]}
        actions={
          <Link
            href="/pages/settings"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            {t("editProfile")}
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* User Info Card */}
        <div className="xl:col-span-2">
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            {/* Avatar + Name */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {initials}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-dark-6">{user.roleDisplayName}</p>
                <StatusBadge
                  variant={user.isActive ? "success" : "neutral"}
                  className="mt-1"
                >
                  {user.isActive ? tCommon("active") : tCommon("inactive")}
                </StatusBadge>
              </div>
            </div>

            {/* Details */}
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-body-sm text-dark-6">
                  {tCommon("email")}
                </dt>
                <dd className="font-medium text-dark dark:text-white">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">{t("role")}</dt>
                <dd className="font-medium text-dark dark:text-white">
                  {user.roleDisplayName}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">
                  {t("memberSince")}
                </dt>
                <dd className="font-medium text-dark dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-body-sm text-dark-6">
                  {t("lastUpdated")}
                </dt>
                <dd className="font-medium text-dark dark:text-white">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>

            {/* Permissions summary */}
            <div className="mt-5 border-t border-stroke pt-5 dark:border-dark-3">
              <h4 className="mb-3 text-body-sm font-medium text-dark dark:text-white">
                {t("permissions")}
              </h4>
              <p className="text-sm text-dark-6">
                {t("permissionsCount", { count: getTokenPermissions().length })}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Accessible Stores */}
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {t("accessibleStores")}
            </h3>
            {loadingResources ? (
              <div className="flex justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : stores.length === 0 ? (
              <p className="text-body-sm text-dark-6">{t("noStores")}</p>
            ) : (
              <ul className="space-y-2">
                {stores.map((store) => (
                  <li
                    key={store.id}
                    className="flex items-center justify-between rounded-lg border border-stroke px-4 py-3 dark:border-dark-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {store.name}
                      </p>
                      <p className="text-xs text-dark-6">
                        {store.code} — {store.city}
                      </p>
                    </div>
                    <StatusBadge
                      variant={store.isActive ? "success" : "neutral"}
                    >
                      {store.isActive ? tCommon("active") : tCommon("inactive")}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accessible Warehouses */}
          <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {t("accessibleWarehouses")}
            </h3>
            {loadingResources ? (
              <div className="flex justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : warehouses.length === 0 ? (
              <p className="text-body-sm text-dark-6">{t("noWarehouses")}</p>
            ) : (
              <ul className="space-y-2">
                {warehouses.map((wh) => (
                  <li
                    key={wh.id}
                    className="flex items-center justify-between rounded-lg border border-stroke px-4 py-3 dark:border-dark-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white">
                        {wh.name}
                      </p>
                      <p className="text-xs text-dark-6">
                        {wh.code} — {wh.storeName}
                      </p>
                    </div>
                    <StatusBadge
                      variant={wh.isActive ? "success" : "neutral"}
                    >
                      {wh.isActive ? tCommon("active") : tCommon("inactive")}
                    </StatusBadge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
