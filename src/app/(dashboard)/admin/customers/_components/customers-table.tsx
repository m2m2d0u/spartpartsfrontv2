"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { Customer } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  customers: Customer[];
  totalElements: number;
  initialPage: number;
};

export function CustomersTable({ customers: initialCustomers, totalElements: initialTotal, initialPage }: Props) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("customers");
  const tCommon = useTranslations("common");

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: Customer[]; totalElements: number }>(
      `/customers?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setCustomers(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteCustomer } = await import("@/services/customers.service");
    await deleteCustomer(deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={`/admin/customers/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "company",
      header: t("company"),
      render: (row) => row.company || "—",
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
      key: "portal",
      header: t("portalAccess"),
      render: (row) => (
        <StatusBadge variant={row.portalAccess ? "success" : "neutral"}>
          {row.portalAccess ? t("enabled") : t("disabled")}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <PermissionGate permission={Permission.CUSTOMER_UPDATE}>
            <Link
              href={`/admin/customers/${row.id}/edit`}
              className="text-body-sm text-primary hover:underline"
            >
              {tCommon("edit")}
            </Link>
          </PermissionGate>
          <PermissionGate permission={Permission.CUSTOMER_DELETE}>
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
        searchPlaceholder={t("searchCustomers")}
        rowKey={(row) => row.id}
        emptyMessage={t("noCustomers")}
        emptyDescription={t("noCustomersDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteCustomerTitle")}
        description={t("deleteCustomerDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
