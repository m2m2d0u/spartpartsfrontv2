"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getStoreStatusVariant } from "@/lib/status-variants";
import { PermissionGate } from "@/components/PermissionGate";
import { usePermissions } from "@/hooks/use-permissions";
import { Permission } from "@/types";
import type { Store } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  stores: Store[];
  totalElements: number;
  initialPage: number;
};

export function StoresTable({ stores: initialStores, totalElements: initialTotal, initialPage }: Props) {
  const [stores, setStores] = useState(initialStores);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("stores");
  const tCommon = useTranslations("common");
  const { hasPermission } = usePermissions();

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: Store[]; totalElements: number }>(
      `/stores?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setStores(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

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
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const columns: Column<Store>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={
            hasPermission(Permission.STORE_UPDATE)
              ? `/admin/stores/${row.id}`
              : `/admin/stores`
          }
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
          <PermissionGate permission={Permission.STORE_UPDATE}>
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
          </PermissionGate>
          <PermissionGate permission={Permission.STORE_DELETE}>
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
        searchPlaceholder={t("searchStores")}
        rowKey={(row) => row.id}
        emptyMessage={t("noStores")}
        emptyDescription={t("noStoresDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
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
