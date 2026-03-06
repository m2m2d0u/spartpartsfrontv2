"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { Part } from "@/types";

const PAGE_SIZE = 20;

type Props = {
  parts: Part[];
  totalElements: number;
  initialPage: number;
};

export function PartsTable({ parts: initialParts, totalElements: initialTotal, initialPage }: Props) {
  const [parts, setParts] = useState(initialParts);
  const [totalElements, setTotalElements] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const t = useTranslations("parts");
  const tCommon = useTranslations("common");

  const fetchParts = useCallback(async (page: number, query: string) => {
    const { apiGet } = await import("@/services/api-client");
    const params = new URLSearchParams({
      page: String(page - 1),
      size: String(PAGE_SIZE),
    });
    if (query) params.set("name", query);
    const data = await apiGet<{ content: Part[]; totalElements: number }>(
      `/parts?${params}`,
    );
    setParts(data.content);
    setTotalElements(data.totalElements);
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchParts(1, query);
    }, 300);
  }, [fetchParts]);

  const handlePageChange = useCallback((page: number) => {
    fetchParts(page, search);
  }, [fetchParts, search]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deletePart } = await import("@/services/parts.service");
    await deletePart(deleteId);
    setDeleteId(null);
    setDeleting(false);
    fetchParts(currentPage, search);
  }

  const columns: Column<Part>[] = [
    {
      key: "partNumber",
      header: t("partNumber"),
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
      key: "reference",
      header: t("reference"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">
          {row.reference || "—"}
        </span>
      ),
    },
    {
      key: "name",
      header: t("partName"),
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
      header: t("category"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">
          {row.categoryName || "—"}
        </span>
      ),
    },
    {
      key: "carBrand",
      header: t("carBrand"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">
          {row.carBrandName || "—"}
        </span>
      ),
    },
    {
      key: "sellingPrice",
      header: t("sellingPrice"),
      render: (row) => (
        <span className="font-medium text-dark dark:text-white">
          {row.sellingPrice.toLocaleString("fr-FR")} FCFA
        </span>
      ),
    },
    {
      key: "published",
      header: tCommon("status"),
      render: (row) => (
        <StatusBadge variant={row.published ? "success" : "neutral"}>
          {row.published ? tCommon("published") : tCommon("draft")}
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
            {tCommon("view")}
          </Link>
          <PermissionGate permission={Permission.PART_UPDATE}>
            <Link
              href={`/admin/parts/${row.id}/edit`}
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
        data={parts}
        onSearch={handleSearch}
        searchPlaceholder={t("searchParts")}
        rowKey={(row) => row.id}
        emptyMessage={t("noParts")}
        emptyDescription={t("noPartsDescription")}
        pageSize={PAGE_SIZE}
        totalElements={totalElements}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deletePartTitle")}
        description={t("deletePartDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
