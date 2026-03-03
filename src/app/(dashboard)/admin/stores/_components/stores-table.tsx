"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getStoreStatusVariant } from "@/lib/status-variants";
import type { Store } from "@/types";

type Props = {
  stores: Store[];
};

export function StoresTable({ stores: initialStores }: Props) {
  const [stores, setStores] = useState(initialStores);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("stores");
  const tCommon = useTranslations("common");

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteStore } = await import("@/services/stores.service");
    await deleteStore(deleteId);
    setStores((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  const columns: Column<Store>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={`/admin/stores/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "code",
      header: t("code"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">{row.code}</span>
      ),
    },
    {
      key: "city",
      header: tCommon("city"),
      render: (row) => row.city,
    },
    {
      key: "status",
      header: t("status"),
      render: (row) => (
        <StatusBadge variant={getStoreStatusVariant(row.isActive)}>
          {row.isActive ? tCommon("active") : tCommon("inactive")}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/stores/${row.id}/edit`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("edit")}
          </Link>
          <Link
            href={`/admin/stores/${row.id}/settings`}
            className="text-body-sm text-dark-5 hover:underline dark:text-dark-6"
          >
            {t("settings")}
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="text-body-sm text-red hover:underline"
          >
            {tCommon("delete")}
          </button>
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
        searchPlaceholder={t("searchStores")}
        rowKey={(row) => row.id}
        emptyMessage={t("noStores")}
        emptyDescription={t("noStoresDescription")}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteStoreTitle")}
        description={t("deleteStoreDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
