"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getStockTransferStatusVariant } from "@/lib/status-variants";
import type { StockTransfer, StockTransferStatus } from "@/types";

const STATUSES: StockTransferStatus[] = [
  "PENDING",
  "IN_TRANSIT",
  "COMPLETED",
  "CANCELLED",
];

type Props = {
  transfers: StockTransfer[];
};

export function StockTransfersTable({ transfers: initialTransfers }: Props) {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const t = useTranslations("stockTransfers");
  const tCommon = useTranslations("common");

  const refetch = useCallback(async (status: string) => {
    const { apiGet } = await import("@/services/api-client");
    let path = "/stock-transfers?page=0&size=200";
    if (status) path += `&status=${status}`;
    const data = await apiGet<{
      content: StockTransfer[];
      totalElements: number;
    }>(path);
    setTransfers(data.content);
  }, []);

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    refetch(value);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteStockTransfer } = await import(
      "@/services/stock-transfers.service"
    );
    await deleteStockTransfer(deleteId);
    setTransfers((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  const filtered = transfers.filter((tr) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tr.transferNumber.toLowerCase().includes(q) ||
      tr.sourceWarehouseName.toLowerCase().includes(q) ||
      tr.destinationWarehouseName.toLowerCase().includes(q)
    );
  });

  const columns: Column<StockTransfer>[] = [
    {
      key: "transferNumber",
      header: t("transferNumber"),
      render: (row) => (
        <Link
          href={`/admin/stock/transfers/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.transferNumber}
        </Link>
      ),
    },
    {
      key: "source",
      header: t("sourceWarehouse"),
      render: (row) => row.sourceWarehouseName,
    },
    {
      key: "destination",
      header: t("destinationWarehouse"),
      render: (row) => row.destinationWarehouseName,
    },
    {
      key: "items",
      header: t("itemsCount"),
      render: (row) => row.items.length,
    },
    {
      key: "transferDate",
      header: t("transferDate"),
      render: (row) => new Date(row.transferDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: tCommon("status"),
      render: (row) => (
        <StatusBadge variant={getStockTransferStatusVariant(row.status)}>
          {t(`status_${row.status}`)}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/stock/transfers/${row.id}`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("view")}
          </Link>
          {row.status === "PENDING" && (
            <>
              <Link
                href={`/admin/stock/transfers/${row.id}/edit`}
                className="text-body-sm text-primary hover:underline"
              >
                {tCommon("edit")}
              </Link>
              <button
                type="button"
                onClick={() => setDeleteId(row.id)}
                className="text-body-sm text-red hover:underline"
              >
                {tCommon("delete")}
              </button>
            </>
          )}
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={filtered}
        onSearch={setSearch}
        searchPlaceholder={t("searchTransfers")}
        filterSlot={
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">{t("allStatuses")}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status_${s}`)}
              </option>
            ))}
          </select>
        }
        rowKey={(row) => row.id}
        emptyMessage={t("noTransfers")}
        emptyDescription={t("noTransfersDescription")}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteTransferTitle")}
        description={t("deleteTransferDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
