"use client";

import { useState } from "react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Part } from "@/types";

type Props = {
  parts: Part[];
};

export function PartsTable({ parts: initialParts }: Props) {
  const [parts, setParts] = useState(initialParts);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(search.toLowerCase()) ||
      (p.categoryName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deletePart } = await import("@/services/parts.service");
    await deletePart(deleteId);
    setParts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  const columns: Column<Part>[] = [
    {
      key: "partNumber",
      header: "Part #",
      render: (row) => (
        <Link
          href={`/admin/parts/${row.id}`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.partNumber}
        </Link>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <Link
          href={`/admin/parts/${row.id}`}
          className="hover:text-primary"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="text-body-sm text-dark-6">
          {row.categoryName || "—"}
        </span>
      ),
    },
    {
      key: "sellingPrice",
      header: "Selling Price",
      render: (row) => (
        <span className="font-medium text-dark dark:text-white">
          {row.sellingPrice.toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      key: "published",
      header: "Status",
      render: (row) => (
        <StatusBadge variant={row.published ? "success" : "neutral"}>
          {row.published ? "Published" : "Draft"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/parts/${row.id}`}
            className="text-body-sm text-dark-5 hover:underline dark:text-dark-6"
          >
            View
          </Link>
          <Link
            href={`/admin/parts/${row.id}/edit`}
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
        searchPlaceholder="Search parts..."
        rowKey={(row) => row.id}
        emptyMessage="No parts found"
        emptyDescription="Create your first part to get started"
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Part"
        description="Are you sure you want to delete this part? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
