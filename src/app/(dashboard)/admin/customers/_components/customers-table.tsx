"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { Customer } from "@/types";

type Props = {
  customers: Customer[];
};

export function CustomersTable({ customers: initialCustomers }: Props) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("customers");
  const tCommon = useTranslations("common");

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
    setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
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
