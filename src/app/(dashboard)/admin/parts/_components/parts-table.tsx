"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import type { Part } from "@/types";

type Props = {
  parts: Part[];
};

export function PartsTable({ parts: initialParts }: Props) {
  const [parts, setParts] = useState(initialParts);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("parts");
  const tCommon = useTranslations("common");

  const filtered = parts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(search.toLowerCase()) ||
      (p.categoryName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.carBrandName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (p.carModelName ?? "").toLowerCase().includes(search.toLowerCase()),
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
        data={filtered}
        onSearch={setSearch}
        searchPlaceholder={t("searchParts")}
        rowKey={(row) => row.id}
        emptyMessage={t("noParts")}
        emptyDescription={t("noPartsDescription")}
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
