import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui/status-badge";

type StockBadgeProps = {
  totalStock: number;
  className?: string;
};

export function StockBadge({ totalStock, className }: StockBadgeProps) {
  const t = useTranslations("shop");

  if (totalStock <= 0) {
    return (
      <StatusBadge variant="error" className={className}>
        {t("outOfStock")}
      </StatusBadge>
    );
  }

  if (totalStock < 5) {
    return (
      <StatusBadge variant="warning" className={className}>
        {t("lowStock")}
      </StatusBadge>
    );
  }

  return (
    <StatusBadge variant="success" className={className}>
      {t("inStock")}
    </StatusBadge>
  );
}
