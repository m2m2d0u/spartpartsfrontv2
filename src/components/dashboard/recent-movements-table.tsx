import { getTranslations } from "next-intl/server";
import type { RecentMovementRow } from "@/types/dashboard";

type Props = {
  items: RecentMovementRow[];
};

export async function RecentMovementsTable({ items }: Props) {
  const t = await getTranslations("dashboard");

  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        {t("recentMovements")}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stroke text-dark-5 dark:border-dark-3 dark:text-dark-6">
              <th className="pb-3 pr-4 font-medium">{t("partName")}</th>
              <th className="pb-3 pr-4 font-medium">{t("warehouse")}</th>
              <th className="pb-3 pr-4 font-medium">{t("type")}</th>
              <th className="pb-3 pr-4 text-right font-medium">{t("qty")}</th>
              <th className="pb-3 text-right font-medium">{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.movementId}
                className="border-b border-stroke last:border-0 dark:border-dark-3"
              >
                <td className="py-3 pr-4 text-dark dark:text-white">
                  {item.partName}
                </td>
                <td className="py-3 pr-4 text-dark-5 dark:text-dark-6">
                  {item.warehouseName}
                </td>
                <td className="py-3 pr-4">
                  <span className="rounded bg-gray-2 px-2 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6">
                    {item.type.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right">
                  <span
                    className={
                      item.quantityChange > 0
                        ? "text-green"
                        : item.quantityChange < 0
                          ? "text-red"
                          : "text-dark dark:text-white"
                    }
                  >
                    {item.quantityChange > 0 ? "+" : ""}
                    {item.quantityChange}
                  </span>
                </td>
                <td className="py-3 text-right text-dark-5 dark:text-dark-6">
                  {item.createdAt.split("T")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
