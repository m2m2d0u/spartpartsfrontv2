"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getInvoiceStatusVariant } from "@/lib/status-variants";
import { standardFormat } from "@/lib/format-number";
import { InvoiceStatusCode, InvoiceTypeCode } from "@/types";
import type { Invoice, InvoiceStatus, InvoiceType } from "@/types";

const STATUSES: InvoiceStatus[] = Object.values(InvoiceStatusCode);

const TYPES: InvoiceType[] = Object.values(InvoiceTypeCode);

type Props = {
  invoices: Invoice[];
};

export function InvoicesTable({ invoices: initial }: Props) {
  const [invoices, setInvoices] = useState(initial);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const t = useTranslations("invoices");
  const tCommon = useTranslations("common");

  const refetch = useCallback(
    async (status: string, type: string) => {
      const { apiGet } = await import("@/services/api-client");
      let path = "/invoices?page=0&size=200";
      if (status) path += `&status=${status}`;
      if (type) path += `&invoiceType=${type}`;
      const data = await apiGet<{
        content: Invoice[];
        totalElements: number;
      }>(path);
      setInvoices(data.content);
    },
    [],
  );

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    refetch(value, typeFilter);
  }

  function handleTypeChange(value: string) {
    setTypeFilter(value);
    refetch(statusFilter, value);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteInvoice } = await import("@/services/invoices.service");
    await deleteInvoice(deleteId);
    setInvoices((prev) => prev.filter((inv) => inv.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  async function handleDownload(id: string, invoiceNumber: string) {
    const { downloadInvoicePdf } = await import(
      "@/services/invoices.service"
    );
    const filename = `${invoiceNumber.replace(/\//g, "-")}.pdf`;
    await downloadInvoicePdf(id, filename);
  }

  const filtered = invoices.filter((inv) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q)
    );
  });

  const columns: Column<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: t("invoiceNumber"),
      render: (row) => (
        <Link
          href={`/admin/invoices/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.invoiceNumber}
        </Link>
      ),
    },
    {
      key: "invoiceType",
      header: t("invoiceType"),
      render: (row) => (
        <StatusBadge variant="neutral">
          {t(`type_${row.invoiceType}`)}
        </StatusBadge>
      ),
    },
    {
      key: "customer",
      header: t("customer"),
      render: (row) => row.customerName,
    },
    {
      key: "status",
      header: tCommon("status"),
      render: (row) => (
        <StatusBadge variant={getInvoiceStatusVariant(row.status)}>
          {t(`status_${row.status}`)}
        </StatusBadge>
      ),
    },
    {
      key: "totalAmount",
      header: t("totalAmount"),
      render: (row) => (
        <span className="font-medium text-dark dark:text-white">
          {standardFormat(row.totalAmount)}
        </span>
      ),
    },
    {
      key: "issuedDate",
      header: t("issuedDate"),
      render: (row) => new Date(row.issuedDate).toLocaleDateString(),
    },
    {
      key: "dueDate",
      header: t("dueDate"),
      render: (row) =>
        row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "—",
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/invoices/${row.id}`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("view")}
          </Link>
          <button
            type="button"
            onClick={() => handleDownload(row.id, row.invoiceNumber)}
            className="text-body-sm text-primary hover:underline"
          >
            {t("downloadPdf")}
          </button>
          {row.status === InvoiceStatusCode.DRAFT && (
            <>
              <PermissionGate permission={Permission.INVOICE_UPDATE}>
                <Link
                  href={`/admin/invoices/${row.id}/edit`}
                  className="text-body-sm text-primary hover:underline"
                >
                  {tCommon("edit")}
                </Link>
              </PermissionGate>
              <PermissionGate permission={Permission.INVOICE_DELETE}>
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
        searchPlaceholder={t("searchInvoices")}
        filterSlot={
          <div className="flex gap-2">
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
            <select
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">{t("allTypes")}</option>
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`type_${type}`)}
                </option>
              ))}
            </select>
          </div>
        }
        rowKey={(row) => row.id}
        emptyMessage={t("noInvoices")}
        emptyDescription={t("noInvoicesDescription")}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteInvoiceTitle")}
        description={t("deleteInvoiceDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
