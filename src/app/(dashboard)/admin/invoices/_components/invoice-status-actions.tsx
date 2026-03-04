"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormSection } from "@/components/FormSection";
import type { InvoiceStatus } from "@/types";

type Props = {
  invoiceId: string;
  currentStatus: InvoiceStatus;
};

const STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  DRAFT: ["SENT", "CANCELLED"],
  SENT: ["PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED", "ACCEPTED"],
  ACCEPTED: ["PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"],
  PARTIALLY_PAID: ["PAID", "OVERDUE", "CANCELLED"],
  OVERDUE: ["PAID", "PARTIALLY_PAID", "CANCELLED"],
  PAID: [],
  CANCELLED: [],
  EXPIRED: [],
};

const STATUS_BUTTON_STYLES: Partial<Record<InvoiceStatus, string>> = {
  PAID: "bg-[#027A48] text-white hover:bg-opacity-90",
  SENT: "bg-primary text-white hover:bg-opacity-90",
  ACCEPTED: "bg-primary text-white hover:bg-opacity-90",
  PARTIALLY_PAID:
    "bg-[#B54708] text-white hover:bg-opacity-90",
  OVERDUE: "bg-[#B42318] text-white hover:bg-opacity-90",
  CANCELLED:
    "border border-red text-red hover:bg-red/5",
};

export function InvoiceStatusActions({ invoiceId, currentStatus }: Props) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const t = useTranslations("invoices");

  const transitions = STATUS_TRANSITIONS[currentStatus] || [];

  if (transitions.length === 0) return null;

  async function handleStatusChange(newStatus: InvoiceStatus) {
    setUpdating(true);
    try {
      const { updateInvoiceStatus } = await import(
        "@/services/invoices.service"
      );
      await updateInvoiceStatus(invoiceId, { status: newStatus });
      router.refresh();
    } catch {
      // Silently fail — user can retry
    } finally {
      setUpdating(false);
    }
  }

  return (
    <FormSection title={t("changeStatus")}>
      <div className="flex flex-wrap gap-3">
        {transitions.map((status) => (
          <button
            key={status}
            type="button"
            disabled={updating}
            onClick={() => handleStatusChange(status)}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
              STATUS_BUTTON_STYLES[status] ||
              "border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
            }`}
          >
            {t(`status_${status}`)}
          </button>
        ))}
      </div>
    </FormSection>
  );
}
