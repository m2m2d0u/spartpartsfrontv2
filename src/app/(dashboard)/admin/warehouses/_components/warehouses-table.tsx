"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getWarehouseStatusVariant } from "@/lib/status-variants";
import { PermissionGate } from "@/components/PermissionGate";
import { usePermissions } from "@/hooks/use-permissions";
import { Permission } from "@/types";
import type { Warehouse, Store } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  warehouses: Warehouse[];
  stores: Store[];
  totalElements: number;
  initialPage: number;
};

export function WarehousesTable({
  warehouses: initialWarehouses,
  stores,
  totalElements: initialTotal,
  initialPage,
}: Props) {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("");
  const t = useTranslations("warehouses");
  const tCommon = useTranslations("common");
  const { hasPermission } = usePermissions();

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: Warehouse[]; totalElements: number }>(
      `/warehouses?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setWarehouses(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  const filtered = warehouses.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.code.toLowerCase().includes(search.toLowerCase()) ||
      w.city.toLowerCase().includes(search.toLowerCase());
    const matchesStore = !storeFilter || w.storeId === storeFilter;
    return matchesSearch && matchesStore;
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteWarehouse } = await import(
      "@/services/warehouses.service"
    );
    await deleteWarehouse(deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const columns: Column<Warehouse>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={
            hasPermission(Permission.WAREHOUSE_UPDATE)
              ? `/admin/warehouses/${row.id}`
              : `/admin/warehouses`
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
      key: "store",
      header: t("store"),
      render: (row) => row.storeName,
    },
    {
      key: "city",
      header: tCommon("city"),
      render: (row) => row.city,
    },
    {
      key: "contact",
      header: t("contact"),
      render: (row) => row.contactPerson,
    },
    {
      key: "status",
      header: t("status"),
      render: (row) => (
        <StatusBadge variant={getWarehouseStatusVariant(row.isActive)}>
          {row.isActive ? tCommon("active") : tCommon("inactive")}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <PermissionGate permission={Permission.WAREHOUSE_UPDATE}>
            <Link
              href={`/admin/warehouses/${row.id}/edit`}
              className="text-body-sm text-primary hover:underline"
            >
              {tCommon("edit")}
            </Link>
          </PermissionGate>
          <PermissionGate permission={Permission.WAREHOUSE_DELETE}>
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
        searchPlaceholder={t("searchWarehouses")}
        filterSlot={
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">{t("allStores")}</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        }
        rowKey={(row) => row.id}
        emptyMessage={t("noWarehouses")}
        emptyDescription={t("noWarehousesDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteWarehouseTitle")}
        description={t("deleteWarehouseDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
