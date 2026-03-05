import { getTranslations } from "next-intl/server";
import { compactFormat } from "@/lib/format-number";
import type { DashboardData } from "@/types/dashboard";

type Props = {
  data: DashboardData;
};

type Card = {
  label: string;
  value: string;
  variant?: "default" | "warning";
};

export async function KpiCards({ data }: Props) {
  const t = await getTranslations("dashboard");

  const cards: Card[] = [];

  if (data.roleLevel === "SYSTEM" || data.roleLevel === "STORE") {
    cards.push(
      {
        label: t("totalParts"),
        value: compactFormat(data.totalParts ?? 0),
      },
      {
        label: t("monthlyRevenue"),
        value: compactFormat(data.monthlyRevenue ?? 0),
      },
      {
        label: t("pendingOrders"),
        value: compactFormat(data.pendingOrdersCount ?? 0),
      },
      {
        label: t("lowStockAlerts"),
        value: compactFormat(data.lowStockCount ?? 0),
        variant: (data.lowStockCount ?? 0) > 0 ? "warning" : "default",
      },
    );
  } else {
    // WAREHOUSE level
    cards.push(
      {
        label: t("totalParts"),
        value: compactFormat(data.totalParts ?? 0),
      },
      {
        label: t("lowStockAlerts"),
        value: compactFormat(data.lowStockCount ?? 0),
        variant: (data.lowStockCount ?? 0) > 0 ? "warning" : "default",
      },
      {
        label: t("todayMovements"),
        value: compactFormat(data.todayMovementsCount ?? 0),
      },
      {
        label: t("pendingTransfers"),
        value: compactFormat(data.pendingTransfersCount ?? 0),
      },
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card"
        >
          <p className="text-body-sm text-dark-6">{card.label}</p>
          <p
            className={`mt-1 text-2xl font-bold ${
              card.variant === "warning"
                ? "text-[#F59E0B]"
                : "text-dark dark:text-white"
            }`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
