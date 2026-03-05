"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import type { TimeSeriesPoint } from "@/types/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  data: TimeSeriesPoint[];
  title: string;
};

export function MovementsChart({ data, title }: Props) {
  if (!data || data.length === 0) {
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

  const series = [
    {
      name: title,
      data: data.map((d) => ({ x: d.date, y: d.value })),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#5750F1"],
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "60%" },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "12px" } },
    },
    yaxis: {
      labels: { style: { fontSize: "12px" } },
    },
    grid: {
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
    },
    tooltip: { x: { format: "dd MMM" } },
  };

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        {title}
      </h3>
      <div className="-ml-4 -mr-2">
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
}
