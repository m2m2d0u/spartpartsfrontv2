"use client";

import { useState } from "react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { Category } from "@/types";

type Props = {
  categories: Category[];
};

export function CategoriesTable({ categories: initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteCategory } = await import(
      "@/services/categories.service"
    );
    await deleteCategory(deleteId);
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <Link
          href={`/admin/parts/categories/${row.id}/edit`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span className="line-clamp-1 text-body-sm text-dark-6">
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/parts/categories/${row.id}/edit`}
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
        searchPlaceholder="Search categories..."
        rowKey={(row) => row.id}
        emptyMessage="No categories found"
        emptyDescription="Create your first category to organise parts"
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
