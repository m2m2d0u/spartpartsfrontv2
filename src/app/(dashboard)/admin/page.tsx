import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getDashboard } from "@/services/dashboard.server";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { AlertsBanner } from "@/components/dashboard/alerts-banner";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { LowStockTable } from "@/components/dashboard/low-stock-table";
import { TopSellingTable } from "@/components/dashboard/top-selling-table";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import { RecentMovementsTable } from "@/components/dashboard/recent-movements-table";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const t = await getTranslations("dashboard");

  let data;
  try {
    data = await getDashboard();
  } catch {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <p className="text-body-sm text-dark-5 dark:text-dark-6">
          {t("failedLoad")}
        </p>
      </div>
    );
  }

  const isSystem = data.roleLevel === "SYSTEM";
  const isStore = data.roleLevel === "STORE";
  const isWarehouse = data.roleLevel === "WAREHOUSE";

  return (
    <>
      <div className="mb-6">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          {t("title")}
        </h2>
        <p className="mt-1 text-body-sm text-dark-6">{t("welcome")}</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-[10px] bg-gray-2 dark:bg-dark-2"
                />
              ))}
            </div>
          }
        >
          <KpiCards data={data} />
        </Suspense>
      </div>

      {/* Alerts */}
      <div className="mb-6">
        <AlertsBanner data={data} />
      </div>

      {/* Charts */}
      <ChartsSection
        data={data}
        labels={{
          revenueChart: t("revenueChart"),
          ordersByStatus: t("ordersByStatus"),
          stockMovements: t("stockMovements"),
        }}
      />

      {/* Tables */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {(isSystem || isStore) && data.topSellingParts && (
          <TopSellingTable items={data.topSellingParts} />
        )}

        {data.lowStockItems && data.lowStockItems.length > 0 && (
          <LowStockTable items={data.lowStockItems} />
        )}

        {(isSystem || isStore) && data.recentOrders && (
          <RecentOrdersTable items={data.recentOrders} />
        )}

        {isWarehouse && data.recentMovements && (
          <RecentMovementsTable items={data.recentMovements} />
        )}
      </div>
    </>
  );
}
