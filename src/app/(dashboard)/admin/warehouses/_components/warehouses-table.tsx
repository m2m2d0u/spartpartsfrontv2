"use client";

import { useState } from "react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getWarehouseStatusVariant } from "@/lib/status-variants";
import type { Warehouse, Store } from "@/types";

type Props = {
  warehouses: Warehouse[];
  stores: Store[];
};

export function WarehousesTable({
  warehouses: initialWarehouses,
  stores,
}: Props) {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("");

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
    setWarehouses((prev) => prev.filter((w) => w.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  const columns: Column<Warehouse>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <Link
          href={`/admin/warehouses/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "code",
      header: "Code",
      render: (row) => (
        <span className="text-body-sm text-dark-6">{row.code}</span>
      ),
    },
    {
      key: "store",
      header: "Store",
      render: (row) => row.storeName,
    },
    {
      key: "city",
      header: "City",
      render: (row) => row.city,
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => row.contactPerson,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge variant={getWarehouseStatusVariant(row.isActive)}>
          {row.isActive ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/warehouses/${row.id}/edit`}
            className="text-body-sm text-primary hover:underline"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(row.id)}
            className="text-body-sm text-red hover:underline"
          >
            Delete
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
        searchPlaceholder="Search warehouses..."
        filterSlot={
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">All Stores</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        }
        rowKey={(row) => row.id}
        emptyMessage="No warehouses found"
        emptyDescription="Create your first warehouse to get started"
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Warehouse"
        description="Are you sure you want to delete this warehouse? This action cannot be undone. Make sure no stock is held in this warehouse."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
