"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { Category } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  categories: Category[];
  totalElements: number;
  initialPage: number;
};

export function CategoriesTable({ categories: initialCategories, totalElements: initialTotal, initialPage }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("categories");
  const tCommon = useTranslations("common");

  const fetchPage = useCallback(async (page: number) => {
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{ content: Category[]; totalElements: number }>(
      `/categories?page=${page - 1}&size=${PAGE_SIZE}`,
    );
    setCategories(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

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
    setDeleteId(null);
    setDeleting(false);
    fetchPage(currentPage);
  }

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: t("name"),
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
      header: t("description"),
      render: (row) => (
        <span className="line-clamp-1 text-body-sm text-dark-6">
          {row.description || "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t("created"),
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
          <PermissionGate permission={Permission.PART_UPDATE}>
            <Link
              href={`/admin/parts/categories/${row.id}/edit`}
              className="text-body-sm text-primary hover:underline"
            >
              {tCommon("edit")}
            </Link>
          </PermissionGate>
          <PermissionGate permission={Permission.PART_DELETE}>
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
        searchPlaceholder={t("searchCategories")}
        rowKey={(row) => row.id}
        emptyMessage={t("noCategories")}
        emptyDescription={t("noCategoriesDescription")}
        pageSize={PAGE_SIZE}
        totalElements={search ? undefined : totalElements}
        currentPage={search ? undefined : currentPage}
        onPageChange={search ? undefined : fetchPage}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteCategoryTitle")}
        description={t("deleteCategoryDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
