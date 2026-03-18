"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import InputGroup from "@/components/FormElements/InputGroup";
import { searchWarehouses } from "@/services/warehouses.service";
import { adjustWarehouseStock } from "@/services/warehouse-stock.service";
import type { Warehouse } from "@/types";

type StockEntry = {
  warehouseId: string;
  quantity: string;
  notes: string;
};

type InitialStockModalProps = {
  open: boolean;
  partId: string;
  partName: string;
  partNumber: string;
  onComplete: () => void;
  onSkip: () => void;
};

export function InitialStockModal({
  open,
  partId,
  partName,
  partNumber,
  onComplete,
  onSkip,
}: InitialStockModalProps) {
  const t = useTranslations("parts");
  const tCommon = useTranslations("common");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [entries, setEntries] = useState<StockEntry[]>([
    { warehouseId: "", quantity: "", notes: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      loadWarehouses();
    }
  }, [open]);

  async function loadWarehouses() {
    try {
      const data = await searchWarehouses("");
      setWarehouses(data);
    } catch {
      setError(t("failedLoadWarehouses"));
    }
  }

  const warehouseItems = warehouses
    .filter((w) => w.isActive)
    .map((w) => ({
      value: w.id,
      label: `${w.name} (${w.code})`,
    }));

  function handleAddEntry() {
    setEntries([...entries, { warehouseId: "", quantity: "", notes: "" }]);
  }

  function handleRemoveEntry(index: number) {
    if (entries.length === 1) return;
    setEntries(entries.filter((_, i) => i !== index));
  }

  function handleEntryChange(
    index: number,
    field: keyof StockEntry,
    value: string,
  ) {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  }

  async function handleSubmit() {
    setError("");

    // Validate entries
    const validEntries = entries.filter(
      (e) => e.warehouseId && e.quantity && parseFloat(e.quantity) > 0,
    );

    if (validEntries.length === 0) {
      setError(t("atLeastOneWarehouse"));
      return;
    }

    setLoading(true);

    try {
      // Submit all stock adjustments
      for (const entry of validEntries) {
        await adjustWarehouseStock({
          partId,
          warehouseId: entry.warehouseId,
          quantity: parseFloat(entry.quantity),
          notes: entry.notes || `Initial stock for ${partNumber} - ${partName}`,
        });
      }
      onComplete();
    } catch {
      setError(t("failedAddStock"));
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed left-0 right-0 top-[89px] bottom-0 z-20 flex items-center justify-center bg-black/50 lg:left-[290px]">
      <div className="w-full max-w-2xl rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            {t("addInitialStock")}
          </h3>
          <p className="mt-1 text-sm text-body-color dark:text-dark-6">
            {t("addInitialStockDescription", {
              partName: partName,
              partNumber: partNumber,
            })}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {error}
          </div>
        )}

        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-dark dark:text-white">
                  {t("warehouseEntry", { number: index + 1 })}
                </span>
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                    className="text-sm text-red hover:text-red/80"
                  >
                    {tCommon("remove")}
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <SearchableSelect
                  label={t("warehouse")}
                  name={`warehouse-${index}`}
                  placeholder={t("selectWarehouse")}
                  items={warehouseItems}
                  value={entry.warehouseId}
                  onChange={(val) =>
                    handleEntryChange(index, "warehouseId", val)
                  }
                />

                <InputGroup
                  label={t("quantity")}
                  name={`quantity-${index}`}
                  type="number"
                  placeholder="0"
                  required
                  value={entry.quantity}
                  handleChange={(e) =>
                    handleEntryChange(index, "quantity", e.target.value)
                  }
                />

                <div>
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    {t("notes")} ({tCommon("optional")})
                  </label>
                  <textarea
                    name={`notes-${index}`}
                    rows={2}
                    placeholder={t("notesPlaceholder")}
                    value={entry.notes}
                    onChange={(e) =>
                      handleEntryChange(index, "notes", e.target.value)
                    }
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddEntry}
          className="mt-4 text-sm font-medium text-primary hover:text-primary/80"
        >
          + {t("addAnotherWarehouse")}
        </button>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onSkip}
            disabled={loading}
            className="rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            {t("skipForNow")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? tCommon("saving") : t("addStock")}
          </button>
        </div>
      </div>
    </div>
  );
}
