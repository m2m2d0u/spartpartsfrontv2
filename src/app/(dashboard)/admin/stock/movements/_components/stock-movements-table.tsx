"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStockMovementTypeVariant } from "@/lib/status-variants";
import type { StockMovement, Warehouse, StockMovementType } from "@/types";

const MOVEMENT_TYPES: StockMovementType[] = [
  "PURCHASE",
  "SALE",
  "ADJUSTMENT",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "RETURN",
  "CLIENT_ORDER",
  "ORDER_CANCELLATION",
  "INVOICE_CANCELLATION",
  "INITIAL",
];

type Props = {
  movements: StockMovement[];
  warehouses: Warehouse[];
};

export function StockMovementsTable({
  movements: initialMovements,
  warehouses,
}: Props) {
  const [movements, setMovements] = useState(initialMovements);
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const t = useTranslations("stockMovements");

  const refetch = useCallback(
    async (warehouse: string, type: string) => {
      const { apiGet } = await import("@/services/api-client");
      let path = "/stock-movements?page=0&size=200";
      if (warehouse) path += `&warehouseId=${warehouse}`;
      if (type) path += `&type=${type}`;
      const data = await apiGet<{
        content: StockMovement[];
        totalElements: number;
      }>(path);
      setMovements(data.content);
    },
    [],
  );

  function handleWarehouseChange(value: string) {
    setWarehouseFilter(value);
    refetch(value, typeFilter);
  }

  function handleTypeChange(value: string) {
    setTypeFilter(value);
    refetch(warehouseFilter, value);
  }

  const filtered = movements.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.partName.toLowerCase().includes(q) ||
      m.partNumber.toLowerCase().includes(q) ||
      (m.notes && m.notes.toLowerCase().includes(q))
    );
  });

  const columns: Column<StockMovement>[] = [
    {
      key: "date",
      header: t("date"),
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "partNumber",
      header: t("partNumber"),
      render: (row) => (
        <span className="font-medium text-dark dark:text-white">
          {row.partNumber}
        </span>
      ),
    },
    {
      key: "partName",
      header: t("partName"),
      render: (row) => row.partName,
    },
    {
      key: "warehouse",
      header: t("warehouse"),
      render: (row) => row.warehouseName,
    },
    {
      key: "type",
      header: t("type"),
      render: (row) => (
        <StatusBadge variant={getStockMovementTypeVariant(row.type)}>
          {t(`type_${row.type}`)}
        </StatusBadge>
      ),
    },
    {
      key: "quantityChange",
      header: t("qtyChange"),
      render: (row) => (
        <span
          className={
            row.quantityChange > 0
              ? "font-medium text-[#027A48]"
              : "font-medium text-red"
          }
        >
          {row.quantityChange > 0 ? `+${row.quantityChange}` : row.quantityChange}
        </span>
      ),
    },
    {
      key: "balanceAfter",
      header: t("balanceAfter"),
      render: (row) => row.balanceAfter,
    },
    {
      key: "notes",
      header: t("notes"),
      render: (row) => (
        <span className="max-w-[200px] truncate text-body-sm text-dark-6">
          {row.notes || "—"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filtered}
      onSearch={setSearch}
      searchPlaceholder={t("searchMovements")}
      filterSlot={
        <div className="flex items-center gap-3">
          <select
            value={warehouseFilter}
            onChange={(e) => handleWarehouseChange(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">{t("allWarehouses")}</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">{t("allTypes")}</option>
            {MOVEMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`type_${type}`)}
              </option>
            ))}
          </select>
        </div>
      }
      rowKey={(row) => row.id}
      emptyMessage={t("noMovements")}
      emptyDescription={t("noMovementsDescription")}
    />
  );
}
