"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { StockTransferStatus } from "@/types";

type Props = {
  transferId: string;
  status: StockTransferStatus;
};

type Action = "approve" | "complete" | "cancel";

export function TransferActions({ transferId, status }: Props) {
  const router = useRouter();
  const t = useTranslations("stockTransfers");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState<Action | null>(null);

  async function handleAction(action: Action) {
    setPending(true);
    setError("");
    try {
      const {
        approveStockTransfer,
        completeStockTransfer,
        cancelStockTransfer,
      } = await import("@/services/stock-transfers.service");

      if (action === "approve") await approveStockTransfer(transferId);
      else if (action === "complete") await completeStockTransfer(transferId);
      else if (action === "cancel") await cancelStockTransfer(transferId);

      router.refresh();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : t("failedStatusChange");
      setError(msg);
    } finally {
      setPending(false);
      setConfirmAction(null);
    }
  }

  const confirmConfig: Record<
    Action,
    { title: string; description: string; variant: "danger" | "default" }
  > = {
    approve: {
      title: t("approveTransferTitle"),
      description: t("approveTransferDescription"),
      variant: "default",
    },
    complete: {
      title: t("completeTransferTitle"),
      description: t("completeTransferDescription"),
      variant: "default",
    },
    cancel: {
      title: t("cancelTransferTitle"),
      description: t("cancelTransferDescription"),
      variant: "danger",
    },
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {status === "PENDING" && (
          <>
            <PermissionGate permission={Permission.TRANSFER_APPROVE}>
              <button
                type="button"
                onClick={() => setConfirmAction("approve")}
                disabled={pending}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {t("approve")}
              </button>
            </PermissionGate>
            <PermissionGate permission={Permission.TRANSFER_UPDATE}>
              <button
                type="button"
                onClick={() => setConfirmAction("cancel")}
                disabled={pending}
                className="rounded-lg border border-red px-5 py-2.5 text-sm font-medium text-red hover:bg-red/5 disabled:opacity-50"
              >
                {t("cancel")}
              </button>
            </PermissionGate>
          </>
        )}

        {status === "IN_TRANSIT" && (
          <>
            <PermissionGate permission={Permission.TRANSFER_RECEIVE}>
              <button
                type="button"
                onClick={() => setConfirmAction("complete")}
                disabled={pending}
                className="rounded-lg bg-green-light px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {t("complete")}
              </button>
            </PermissionGate>
            <PermissionGate permission={Permission.TRANSFER_UPDATE}>
              <button
                type="button"
                onClick={() => setConfirmAction("cancel")}
                disabled={pending}
                className="rounded-lg border border-red px-5 py-2.5 text-sm font-medium text-red hover:bg-red/5 disabled:opacity-50"
              >
                {t("cancel")}
              </button>
            </PermissionGate>
          </>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red/5 p-3 text-sm text-red">
          {error}
        </div>
      )}

      {confirmAction && (
        <ConfirmDialog
          open
          onClose={() => setConfirmAction(null)}
          onConfirm={() => handleAction(confirmAction)}
          title={confirmConfig[confirmAction].title}
          description={confirmConfig[confirmAction].description}
          confirmLabel={t(confirmAction)}
          variant={confirmConfig[confirmAction].variant}
          loading={pending}
        />
      )}
    </>
  );
}
