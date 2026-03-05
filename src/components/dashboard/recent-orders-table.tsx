import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/ui/status-badge";
import { standardFormat } from "@/lib/format-number";
import type { RecentOrderRow } from "@/types/dashboard";

type Props = {
  items: RecentOrderRow[];
};

const STATUS_VARIANT: Record<string, "success" | "warning" | "info" | "error" | "neutral"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  COMPLETED: "success",
  CANCELLED: "error",
};

export async function RecentOrdersTable({ items }: Props) {
  const t = await getTranslations("dashboard");

  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        {t("recentOrders")}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stroke text-dark-5 dark:border-dark-3 dark:text-dark-6">
              <th className="pb-3 pr-4 font-medium">{t("orderNumber")}</th>
              <th className="pb-3 pr-4 font-medium">{t("customer")}</th>
              <th className="pb-3 pr-4 font-medium">{t("status")}</th>
              <th className="pb-3 pr-4 text-right font-medium">
                {t("total")}
              </th>
              <th className="pb-3 text-right font-medium">{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.orderId}
                className="border-b border-stroke last:border-0 dark:border-dark-3"
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/orders/${item.orderId}`}
                    className="text-primary hover:underline"
                  >
                    {item.orderNumber}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-dark dark:text-white">
                  {item.customerName}
                </td>
                <td className="py-3 pr-4">
                  <StatusBadge
                    variant={STATUS_VARIANT[item.status] ?? "neutral"}
                  >
                    {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                  </StatusBadge>
                </td>
                <td className="py-3 pr-4 text-right text-dark dark:text-white">
                  {standardFormat(item.totalAmount)}
                </td>
                <td className="py-3 text-right text-dark-5 dark:text-dark-6">
                  {item.orderDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
