"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  data: Record<string, number>;
  title: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F59E0B",
  CONFIRMED: "#3B82F6",
  PROCESSING: "#8B5CF6",
  SHIPPED: "#0EA5E9",
  DELIVERED: "#10B981",
  COMPLETED: "#059669",
  CANCELLED: "#EF4444",
};

export function OrdersStatusChart({ data, title }: Props) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (labels.length === 0) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          {title}
        </h3>
        <p className="py-10 text-center text-body-sm text-dark-5 dark:text-dark-6">
          No data available
        </p>
      </div>
    );
  }

  const colors = labels.map((l) => STATUS_COLORS[l] || "#94A3B8");

  const options: ApexOptions = {
    chart: { type: "donut", fontFamily: "inherit" },
    colors,
    labels: labels.map((l) => l.charAt(0) + l.slice(1).toLowerCase()),
    legend: {
      position: "bottom",
      fontFamily: "inherit",
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontFamily: "inherit",
            },
          },
        },
      },
    },
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        {title}
      </h3>
      <Chart options={options} series={values} type="donut" height={280} />
    </div>
  );
}
