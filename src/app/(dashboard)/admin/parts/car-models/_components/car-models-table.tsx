"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { CarModel, CarBrand } from "@/types";

type Props = {
  carModels: CarModel[];
  brands: CarBrand[];
};

export function CarModelsTable({
  carModels: initialCarModels,
  brands,
}: Props) {
  const [carModels, setCarModels] = useState(initialCarModels);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const t = useTranslations("carModels");
  const tCommon = useTranslations("common");

  const filtered = carModels.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.brandName.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = !brandFilter || m.brandId === brandFilter;
    return matchesSearch && matchesBrand;
  });

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { deleteCarModel } = await import(
      "@/services/car-models.service"
    );
    await deleteCarModel(deleteId);
    setCarModels((prev) => prev.filter((m) => m.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  function formatYearRange(from: number | null, to: number | null): string {
    if (from && to) return `${from} – ${to}`;
    if (from) return `${from} –`;
    if (to) return `– ${to}`;
    return "—";
  }

  const columns: Column<CarModel>[] = [
    {
      key: "name",
      header: t("name"),
      render: (row) => (
        <Link
          href={`/admin/parts/car-models/${row.id}/edit`}
          className="font-medium text-dark hover:text-primary dark:text-white"
        >
          {row.name}
        </Link>
      ),
    },
    {
      key: "brandName",
      header: t("brand"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">{row.brandName}</span>
      ),
    },
    {
      key: "years",
      header: t("years"),
      render: (row) => (
        <span className="text-body-sm text-dark-6">
          {formatYearRange(row.yearFrom, row.yearTo)}
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
            href={`/admin/parts/car-models/${row.id}/edit`}
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
      <div className="mb-4 flex items-center gap-3">
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <option value="">{t("allBrands")}</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onSearch={setSearch}
        searchPlaceholder={t("searchCarModels")}
        rowKey={(row) => row.id}
        emptyMessage={t("noCarModels")}
        emptyDescription={t("noCarModelsDescription")}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("deleteCarModelTitle")}
        description={t("deleteCarModelDescription")}
        confirmLabel={tCommon("delete")}
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
