import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { LowStockRow } from "@/types/dashboard";

type Props = {
  items: LowStockRow[];
};

export async function LowStockTable({ items }: Props) {
  const t = await getTranslations("dashboard");

  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        {t("lowStockItems")}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stroke text-dark-5 dark:border-dark-3 dark:text-dark-6">
              <th className="pb-3 pr-4 font-medium">{t("partNumber")}</th>
              <th className="pb-3 pr-4 font-medium">{t("partName")}</th>
              <th className="pb-3 pr-4 font-medium">{t("warehouse")}</th>
              <th className="pb-3 pr-4 text-right font-medium">
                {t("currentStock")}
              </th>
              <th className="pb-3 text-right font-medium">{t("minLevel")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={`${item.partId}-${item.warehouseName}`}
                className="border-b border-stroke last:border-0 dark:border-dark-3"
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/admin/parts/${item.partId}`}
                    className="text-primary hover:underline"
                  >
                    {item.partNumber}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-dark dark:text-white">
                  {item.partName}
                </td>
                <td className="py-3 pr-4 text-dark-5 dark:text-dark-6">
                  {item.warehouseName}
                </td>
                <td className="py-3 pr-4 text-right">
                  <span
                    className={
                      item.currentStock === 0
                        ? "font-medium text-red"
                        : "text-[#F59E0B]"
                    }
                  >
                    {item.currentStock}
                  </span>
                </td>
                <td className="py-3 text-right text-dark-5 dark:text-dark-6">
                  {item.minStockLevel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
