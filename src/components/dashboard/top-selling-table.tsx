import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { standardFormat } from "@/lib/format-number";
import type { TopPartRow } from "@/types/dashboard";

type Props = {
  items: TopPartRow[];
};

export async function TopSellingTable({ items }: Props) {
  const t = await getTranslations("dashboard");

  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
        {t("topSellingParts")}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stroke text-dark-5 dark:border-dark-3 dark:text-dark-6">
              <th className="pb-3 pr-4 font-medium">{t("partNumber")}</th>
              <th className="pb-3 pr-4 font-medium">{t("partName")}</th>
              <th className="pb-3 pr-4 text-right font-medium">
                {t("qtySold")}
              </th>
              <th className="pb-3 text-right font-medium">{t("revenue")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.partId}
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
                <td className="py-3 pr-4 text-right text-dark dark:text-white">
                  {item.quantitySold}
                </td>
                <td className="py-3 text-right font-medium text-dark dark:text-white">
                  {standardFormat(item.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
