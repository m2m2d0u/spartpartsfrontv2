"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { DataTable, type Column } from "@/components/DataTable";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { StatusBadge } from "@/components/ui/status-badge";
import { FormDialog } from "@/components/ui/form-dialog";
import InputGroup from "@/components/FormElements/InputGroup";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { cn } from "@/lib/utils";
import type { Warehouse, WarehouseStock, Part } from "@/types";

type Props = {
  warehouses: Warehouse[];
};

export function WarehouseStockTable({ warehouses }: Props) {
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    warehouses[0]?.id || "",
  );
  const [stockItems, setStockItems] = useState<WarehouseStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<WarehouseStock | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [minStockValue, setMinStockValue] = useState("");
  const [saving, setSaving] = useState(false);

  // Add part state
  const [addPartOpen, setAddPartOpen] = useState(false);
  const [addPartId, setAddPartId] = useState("");
  const [addPartQty, setAddPartQty] = useState("");
  const [addPartNotes, setAddPartNotes] = useState("");
  const [addPartMinStock, setAddPartMinStock] = useState("");
  const [addPartSaving, setAddPartSaving] = useState(false);
  const [addPartError, setAddPartError] = useState("");

  // Available parts (not already in warehouse)
  const [availableParts, setAvailableParts] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingParts, setLoadingParts] = useState(false);

  const t = useTranslations("warehouseStock");
  const tCommon = useTranslations("common");

  const fetchStock = useCallback(async (warehouseId: string) => {
    setLoading(true);
    const { apiGet } = await import("@/services/api-client");
    const data = await apiGet<{
      content: WarehouseStock[];
      totalElements: number;
    }>(`/warehouse-stock?warehouseId=${warehouseId}&page=0&size=500`);
    setStockItems(data.content);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchStock(selectedWarehouse);
    }
  }, [selectedWarehouse, fetchStock]);

  const filtered = stockItems.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.partName.toLowerCase().includes(q) ||
      item.partNumber.toLowerCase().includes(q)
    );
  });

  function handleEditMinStock(item: WarehouseStock) {
    setEditItem(item);
    setEditQuantity(String(item.quantity));
    setMinStockValue(String(item.minStockLevel));
  }

  async function handleSaveMinStock() {
    if (!editItem) return;
    setSaving(true);
    const { updateWarehouseStock } = await import(
      "@/services/warehouse-stock.service"
    );
    await updateWarehouseStock(editItem.id, {
      quantity: Number(editQuantity),
      minStockLevel: Number(minStockValue),
    });
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === editItem.id
          ? { ...item, quantity: Number(editQuantity), minStockLevel: Number(minStockValue) }
          : item,
      ),
    );
    setEditItem(null);
    setSaving(false);
  }

  const searchTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchAvailableParts = useCallback(
    async (name?: string) => {
      setLoadingParts(true);
      try {
        const { apiGet } = await import("@/services/api-client");
        let url = `/parts/not-in-warehouse?warehouseId=${selectedWarehouse}&page=0&size=20`;
        if (name) url += `&name=${encodeURIComponent(name)}`;
        const data = await apiGet<{ content: Part[] }>(url);
        setAvailableParts(
          data.content.map((p) => {
            let label = `${p.partNumber} — ${p.name}`;
            if (p.carBrandName) label += ` — ${p.carBrandName}`;
            if (p.carModelName) label += ` — ${p.carModelName}`;
            return { value: p.id, label };
          }),
        );
      } catch {
        setAddPartError(t("addPartFailed"));
      } finally {
        setLoadingParts(false);
      }
    },
    [selectedWarehouse, t],
  );

  function handlePartSearch(term: string) {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchAvailableParts(term || undefined);
    }, 300);
  }

  async function handleOpenAddPart() {
    setAddPartId("");
    setAddPartQty("");
    setAddPartMinStock("");
    setAddPartNotes("");
    setAddPartError("");
    setAvailableParts([]);
    setAddPartOpen(true);
    fetchAvailableParts();
  }

  async function handleAddPart() {
    if (!addPartId || !addPartQty || Number(addPartQty) <= 0) {
      setAddPartError(t("addPartValidation"));
      return;
    }

    setAddPartSaving(true);
    setAddPartError("");

    try {
      const { adjustWarehouseStock } = await import(
        "@/services/warehouse-stock.service"
      );
      await adjustWarehouseStock({
        warehouseId: selectedWarehouse,
        partId: addPartId,
        quantity: Number(addPartQty),
        minStockLevel: addPartMinStock ? Number(addPartMinStock) : undefined,
        notes: addPartNotes || undefined,
      });

      // Refresh the stock list
      await fetchStock(selectedWarehouse);
      setAddPartOpen(false);
    } catch {
      setAddPartError(t("addPartFailed"));
    } finally {
      setAddPartSaving(false);
    }
  }

  const columns: Column<WarehouseStock>[] = [
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
      key: "quantity",
      header: t("quantity"),
      render: (row) => (
        <span
          className={
            row.quantity <= row.minStockLevel
              ? "font-semibold text-red"
              : "text-dark dark:text-white"
          }
        >
          {row.quantity}
        </span>
      ),
    },
    {
      key: "minStockLevel",
      header: t("minStockLevel"),
      render: (row) => row.minStockLevel,
    },
    {
      key: "status",
      header: t("stockStatus"),
      render: (row) =>
        row.quantity <= row.minStockLevel ? (
          <StatusBadge variant="error">{t("lowStock")}</StatusBadge>
        ) : (
          <StatusBadge variant="success">{t("inStock")}</StatusBadge>
        ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end">
          <PermissionGate permission={Permission.STOCK_UPDATE}>
            <button
              type="button"
              onClick={() => handleEditMinStock(row)}
              className="text-body-sm text-primary hover:underline"
            >
              {tCommon("edit")}
            </button>
          </PermissionGate>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <>
      {/* Warehouse tabs + Add Part button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {warehouses.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setSelectedWarehouse(w.id)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm font-medium transition",
                selectedWarehouse === w.id
                  ? "border-primary bg-primary text-white"
                  : "border-stroke bg-white text-dark hover:border-primary hover:text-primary dark:border-dark-3 dark:bg-gray-dark dark:text-white dark:hover:border-primary dark:hover:text-primary",
              )}
            >
              {w.name}
            </button>
          ))}
        </div>

        <PermissionGate permission={Permission.STOCK_CREATE}>
          <button
            type="button"
            onClick={handleOpenAddPart}
            disabled={!selectedWarehouse}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {t("addPart")}
          </button>
        </PermissionGate>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-dark-6">
          {t("loading")}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          onSearch={setSearch}
          searchPlaceholder={t("searchStock")}
          rowKey={(row) => row.id}
          emptyMessage={t("noStock")}
          emptyDescription={t("noStockDescription")}
        />
      )}

      {/* Edit Min Stock Level dialog */}
      <FormDialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        onSubmit={handleSaveMinStock}
        title={t("editStock")}
        submitLabel={tCommon("save")}
        cancelLabel={tCommon("cancel")}
        loading={saving}
      >
        <InputGroup
          label={t("quantity")}
          type="number"
          placeholder="0"
          value={editQuantity}
          handleChange={(e) => setEditQuantity(e.target.value)}
          required
        />
        <InputGroup
          label={t("minStockLevel")}
          type="number"
          placeholder="0"
          value={minStockValue}
          handleChange={(e) => setMinStockValue(e.target.value)}
          required
        />
      </FormDialog>

      {/* Add Part to Stock dialog */}
      <FormDialog
        open={addPartOpen}
        onClose={() => setAddPartOpen(false)}
        onSubmit={handleAddPart}
        title={t("addPartTitle")}
        submitLabel={t("addPart")}
        cancelLabel={tCommon("cancel")}
        loading={addPartSaving}
      >
        <SearchableSelect
          label={t("selectPart")}
          items={availableParts}
          value={addPartId}
          onChange={setAddPartId}
          placeholder={t("selectPartPlaceholder")}
          searchPlaceholder={tCommon("search")}
          onSearch={handlePartSearch}
          searching={loadingParts}
          required
        />
        <InputGroup
          label={t("quantity")}
          type="number"
          placeholder="1"
          value={addPartQty}
          handleChange={(e) => setAddPartQty(e.target.value)}
          required
        />
        <InputGroup
          label={t("minStockLevel")}
          type="number"
          placeholder="0"
          value={addPartMinStock}
          handleChange={(e) => setAddPartMinStock(e.target.value)}
        />
        <div>
          <label className="text-body-sm font-medium text-dark dark:text-white">
            {t("notes")}
          </label>
          <textarea
            value={addPartNotes}
            onChange={(e) => setAddPartNotes(e.target.value)}
            placeholder={t("addPartNotesPlaceholder")}
            rows={2}
            className="mt-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
        {addPartError && (
          <p className="text-body-xs text-red">{addPartError}</p>
        )}
      </FormDialog>
    </>
  );
}
