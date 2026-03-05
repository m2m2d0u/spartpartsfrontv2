"use client";

import dynamic from "next/dynamic";
import type { DashboardData } from "@/types/dashboard";

const RevenueChart = dynamic(
  () =>
    import("@/components/dashboard/revenue-chart").then(
      (m) => m.RevenueChart,
    ),
  { ssr: false },
);

const OrdersStatusChart = dynamic(
  () =>
    import("@/components/dashboard/orders-status-chart").then(
      (m) => m.OrdersStatusChart,
    ),
  { ssr: false },
);

const MovementsChart = dynamic(
  () =>
    import("@/components/dashboard/movements-chart").then(
      (m) => m.MovementsChart,
    ),
  { ssr: false },
);

type Props = {
  data: DashboardData;
  labels: {
    revenueChart: string;
    ordersByStatus: string;
    stockMovements: string;
  };
};

export function ChartsSection({ data, labels }: Props) {
  const isSystem = data.roleLevel === "SYSTEM";
  const isStore = data.roleLevel === "STORE";
  const isWarehouse = data.roleLevel === "WAREHOUSE";

  return (
    <>
      {(isSystem || isStore) && (
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <RevenueChart
              data={data.revenueChart ?? []}
              title={labels.revenueChart}
            />
          </div>
          <div className="xl:col-span-4">
            <OrdersStatusChart
              data={data.ordersByStatus ?? {}}
              title={labels.ordersByStatus}
            />
          </div>
        </div>
      )}

      {isWarehouse && (
        <div className="mb-6">
          <MovementsChart
            data={data.movementsChart ?? []}
            title={labels.stockMovements}
          />
        </div>
      )}
    </>
  );
}
