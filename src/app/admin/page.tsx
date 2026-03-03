import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          Dashboard
        </h2>
        <p className="mt-1 text-body-sm text-dark-6">
          Welcome to the Spare Parts Management System
        </p>
      </div>

      {/* Summary Cards Placeholder */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Parts", value: "—" },
          { label: "Low Stock Alerts", value: "—" },
          { label: "Pending Orders", value: "—" },
          { label: "Monthly Revenue", value: "—" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card"
          >
            <p className="text-body-sm text-dark-6">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-dark dark:text-white">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
        <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/stores"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Manage Stores
          </Link>
          <Link
            href="/admin/warehouses"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            Manage Warehouses
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center rounded-lg border border-stroke bg-transparent px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Company Settings
          </Link>
        </div>
      </div>
    </>
  );
}
