"use client";

import { useState } from "react";
import Link from "next/link";
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
      header: "Name",
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
      header: "Code",
      render: (row) => (
        <span className="text-body-sm text-dark-6">{row.code}</span>
      ),
    },
    {
      key: "city",
      header: "City",
      render: (row) => row.city,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge variant={getStoreStatusVariant(row.isActive)}>
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
            href={`/admin/stores/${row.id}/edit`}
            className="text-body-sm text-primary hover:underline"
          >
            Edit
          </Link>
          <Link
            href={`/admin/stores/${row.id}/settings`}
            className="text-body-sm text-dark-5 hover:underline dark:text-dark-6"
          >
            Settings
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
        totalItems={filtered.length}
        page={1}
        pageSize={filtered.length || 10}
        onPageChange={() => {}}
        onSearch={setSearch}
        searchPlaceholder="Search stores..."
        rowKey={(row) => row.id}
        emptyMessage="No stores found"
        emptyDescription="Create your first store to get started"
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Store"
        description="Are you sure you want to delete this store? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
