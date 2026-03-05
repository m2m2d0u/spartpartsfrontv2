import { getTranslations } from "next-intl/server";
import type { DashboardData } from "@/types/dashboard";

type Props = {
  data: DashboardData;
};

export async function AlertsBanner({ data }: Props) {
  const t = await getTranslations("dashboard");

  const alerts: string[] = [];

  if ((data.lowStockCount ?? 0) > 0) {
    alerts.push(t("alertLowStock", { count: data.lowStockCount ?? 0 }));
  }
  if ((data.overdueInvoicesCount ?? 0) > 0) {
    alerts.push(
      t("alertOverdueInvoices", { count: data.overdueInvoicesCount ?? 0 }),
    );
  }
  if ((data.pendingTransfersCount ?? 0) > 0) {
    alerts.push(
      t("alertPendingTransfers", { count: data.pendingTransfersCount ?? 0 }),
    );
  }

  if (alerts.length === 0) return null;

  return (
    <div className="rounded-[10px] border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-5 py-4 dark:border-[#F59E0B]/20 dark:bg-[#F59E0B]/10">
      <div className="flex items-start gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="mt-0.5 shrink-0 text-[#F59E0B]"
        >
          <path
            d="M10 6v4m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="space-y-1">
          {alerts.map((alert) => (
            <p key={alert} className="text-body-sm text-dark dark:text-white">
              {alert}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
