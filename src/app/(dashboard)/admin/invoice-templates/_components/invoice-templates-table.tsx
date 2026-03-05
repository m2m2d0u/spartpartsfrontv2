"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { InvoiceTemplate } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  templates: InvoiceTemplate[];
  totalElements: number;
  initialPage: number;
};

export function InvoiceTemplatesTable({ templates: initial, totalElements: initialTotal, initialPage }: Props) {
  const [templates, setTemplates] = useState(initial);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("invoiceTemplates");
  const tCommon = useTranslations("common");

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: InvoiceTemplate[]; totalElements: number }>(
      `/invoice-templates?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setTemplates(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  const filtered = templates.filter((tpl) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tpl.name.toLowerCase().includes(q) ||
      tpl.description?.toLowerCase().includes(q)
    );
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteInvoiceTemplate } = await import(
      "@/services/invoice-templates.service"
    );
    await deleteInvoiceTemplate(deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const columns: Column<InvoiceTemplate>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={`/admin/invoice-templates/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "description",
      header: t("description"),
      render: (row) => (
        <span className="line-clamp-1 max-w-xs text-dark-6">
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "colors",
      header: t("colors"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <span
            className="inline-block size-5 rounded border border-stroke dark:border-dark-3"
            style={{ backgroundColor: row.primaryColor }}
            title={row.primaryColor}
          />
          <span
            className="inline-block size-5 rounded border border-stroke dark:border-dark-3"
            style={{ backgroundColor: row.accentColor }}
            title={row.accentColor}
          />
        </div>
      ),
    },
    {
      key: "font",
      header: t("font"),
      render: (row) => row.fontFamily,
    },
    {
      key: "design",
      header: t("design"),
      render: (row) => (
        <StatusBadge variant="neutral">
          {t(`design_${row.design}`)}
        </StatusBadge>
      ),
    },
    {
      key: "isDefault",
      header: t("default"),
      render: (row) =>
        row.isDefault ? (
          <StatusBadge variant="success">{tCommon("yes")}</StatusBadge>
        ) : (
          <span className="text-dark-6">{tCommon("no")}</span>
        ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/invoice-templates/${row.id}`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("view")}
          </Link>
          <PermissionGate permission={Permission.INVOICE_UPDATE}>
            <Link
              href={`/admin/invoice-templates/${row.id}/edit`}
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
        searchPlaceholder={t("searchTemplates")}
        rowKey={(row) => row.id}
        emptyMessage={t("noTemplates")}
        emptyDescription={t("noTemplatesDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteTemplateTitle")}
        description={t("deleteTemplateDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
