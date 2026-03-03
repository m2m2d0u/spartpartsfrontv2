"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CarBrand } from "@/types";

type Props = {
  carBrands: CarBrand[];
};

export function CarBrandsTable({ carBrands: initialCarBrands }: Props) {
  const [carBrands, setCarBrands] = useState(initialCarBrands);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("carBrands");
  const tCommon = useTranslations("common");

  const filtered = carBrands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteCarBrand } = await import(
      "@/services/car-brands.service"
    );
    await deleteCarBrand(deleteId);
    setCarBrands((prev) => prev.filter((b) => b.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  const columns: Column<CarBrand>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={`/admin/parts/car-brands/${row.id}/edit`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "logoUrl",
      header: t("logoUrl"),
      render: (row) => (
        <span className="line-clamp-1 text-body-sm text-dark-6">
          {row.logoUrl || "—"}
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
          <Link
            href={`/admin/parts/car-brands/${row.id}/edit`}
            className="text-body-sm text-primary hover:underline"
          >
            {tCommon("edit")}
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
        searchPlaceholder={t("searchCarBrands")}
        rowKey={(row) => row.id}
        emptyMessage={t("noCarBrands")}
        emptyDescription={t("noCarBrandsDescription")}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteCarBrandTitle")}
        description={t("deleteCarBrandDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
