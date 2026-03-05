"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { Supplier } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  suppliers: Supplier[];
  totalElements: number;
  initialPage: number;
};

export function SuppliersTable({ suppliers: initial, totalElements: initialTotal, initialPage }: Props) {
  const [suppliers, setSuppliers] = useState(initial);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("suppliers");
  const tCommon = useTranslations("common");

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: Supplier[]; totalElements: number }>(
      `/suppliers?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setSuppliers(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  const filtered = suppliers.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
      (s.phone && s.phone.toLowerCase().includes(q))
    );
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteSupplier } = await import("@/services/suppliers.service");
    await deleteSupplier(deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const columns: Column<Supplier>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={`/admin/suppliers/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "contactPerson",
      header: t("contactPerson"),
      render: (row) => row.contactPerson || "—",
    },
    {
      key: "email",
      header: tCommon("email"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">{row.email || "—"}</span>
      ),
    },
    {
      key: "phone",
      header: tCommon("phone"),
      render: (row) => row.phone || "—",
    },
    {
      key: "city",
      header: tCommon("city"),
      render: (row) => row.city || "—",
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <PermissionGate permission={Permission.PROCUREMENT_UPDATE}>
            <Link
              href={`/admin/suppliers/${row.id}/edit`}
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
        searchPlaceholder={t("searchSuppliers")}
        rowKey={(row) => row.id}
        emptyMessage={t("noSuppliers")}
        emptyDescription={t("noSuppliersDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteSupplierTitle")}
        description={t("deleteSupplierDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
