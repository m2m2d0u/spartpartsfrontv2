"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission, PurchaseOrderStatusCode } from "@/types";
import { getPurchaseOrderStatusVariant } from "@/lib/status-variants";
import { formatCurrency, type CurrencyFormatOptions } from "@/lib/format-number";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/types";

const STATUSES: PurchaseOrderStatus[] = Object.values(PurchaseOrderStatusCode);

const PAGE_SIZE = 20;

type Props = {
  purchaseOrders: PurchaseOrder[];
  totalElements: number;
  initialPage: number;
  currencyOptions?: CurrencyFormatOptions;
};

export function PurchaseOrdersTable({
  purchaseOrders: initial,
  totalElements: initialTotal,
  initialPage,
  currencyOptions,
}: Props) {
  const [orders, setOrders] = useState(initial);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const t = useTranslations("purchaseOrders");
  const tCommon = useTranslations("common");

  const refetch = useCallback(async (status: string, page: number) => {
    const { apiGet } = await import("@/services/api-client");
    let path = `/purchase-orders?page=${page - 1}&size=${PAGE_SIZE}`;
    if (status) path += `&status=${status}`;
    const data = await apiGet<{
      content: PurchaseOrder[];
      totalElements: number;
    }>(path);
    setOrders(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  const fetchPage = useCallback(
    async (page: number) => {
      await refetch(statusFilter, page);
    },
    [refetch, statusFilter],
  );

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    refetch(value, 1);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deletePurchaseOrder } = await import(
      "@/services/purchase-orders.service"
    );
    await deletePurchaseOrder(deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.poNumber.toLowerCase().includes(q) ||
      o.supplierName.toLowerCase().includes(q)
    );
  });

  const columns: Column<PurchaseOrder>[] = [
    {
      key: "poNumber",
      header: t("poNumber"),
      render: (row) => (
        <Link
          href={`/admin/purchase-orders/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.poNumber}
        </Link>
      ),
    },
    {
      key: "supplier",
      header: t("supplier"),
      render: (row) => row.supplierName,
    },
    {
      key: "status",
      header: tCommon("status"),
      render: (row) => (
        <StatusBadge variant={getPurchaseOrderStatusVariant(row.status)}>
          {t(`status_${row.status}`)}
        </StatusBadge>
      ),
    },
    {
      key: "totalAmount",
      header: t("totalAmount"),
      render: (row) => (
        <span className="font-medium text-dark dark:text-white">
          {formatCurrency(row.totalAmount, currencyOptions)}
        </span>
      ),
    },
    {
      key: "orderDate",
      header: t("orderDate"),
      render: (row) => new Date(row.orderDate).toLocaleDateString(),
    },
    {
      key: "expectedDelivery",
      header: t("expectedDelivery"),
      render: (row) =>
        row.expectedDeliveryDate
          ? new Date(row.expectedDeliveryDate).toLocaleDateString()
          : "—",
    },
    {
      key: "warehouse",
      header: t("destinationWarehouse"),
      render: (row) => row.destinationWarehouseName || "—",
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/purchase-orders/${row.id}`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("view")}
          </Link>
          {row.status === PurchaseOrderStatusCode.DRAFT && (
            <>
              <PermissionGate permission={Permission.PROCUREMENT_UPDATE}>
                <Link
                  href={`/admin/purchase-orders/${row.id}/edit`}
                  className="text-body-sm text-primary hover:underline"
                >
                  {tCommon("edit")}
                </Link>
              </PermissionGate>
              <PermissionGate permission={Permission.PROCUREMENT_DELETE}>
                <button
                  type="button"
                  onClick={() => setDeleteId(row.id)}
                  className="text-body-sm text-red hover:underline"
                >
                  {tCommon("delete")}
                </button>
              </PermissionGate>
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
        searchPlaceholder={t("searchOrders")}
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
        emptyMessage={t("noOrders")}
        emptyDescription={t("noOrdersDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteOrderTitle")}
        description={t("deleteOrderDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
