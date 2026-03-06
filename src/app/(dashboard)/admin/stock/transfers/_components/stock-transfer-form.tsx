"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormSection } from "@/components/FormSection";
import InputGroup from "@/components/FormElements/InputGroup";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import type { Warehouse, StockTransfer, WarehouseStock } from "@/types";

type StockPartOption = {
  partId: string;
  partName: string;
  partNumber: string;
  available: number;
};

type Props = {
  transfer?: StockTransfer;
  initialWarehouses?: Warehouse[];
};

type TransferItemRow = {
  partId: string;
  quantity: string;
};

export function StockTransferForm({
  transfer,
  initialWarehouses = [],
}: Props) {
  const router = useRouter();
  const t = useTranslations("stockTransfers");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [items, setItems] = useState<TransferItemRow[]>(
    transfer?.items.map((i) => ({
      partId: i.partId,
      quantity: String(i.quantity),
    })) || [{ partId: "", quantity: "" }],
  );

  // Warehouse search state
  const [warehouseResults, setWarehouseResults] =
    useState<Warehouse[]>(initialWarehouses);
  const [searchingWarehouses, setSearchingWarehouses] = useState(false);
  const warehouseSearchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Parts in source warehouse with available quantities
  const [stockParts, setStockParts] = useState<StockPartOption[]>([]);
  const [searchingParts, setSearchingParts] = useState(false);
  const partSearchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Map partId -> available quantity for quick lookup
  const availableByPartId = useRef<Map<string, number>>(new Map());
  useEffect(() => {
    const map = new Map<string, number>();
    stockParts.forEach((sp) => map.set(sp.partId, sp.available));
    availableByPartId.current = map;
  }, [stockParts]);

  const warehouseItems = warehouseResults.map((w) => ({
    value: w.id,
    label: `${w.name} (${w.code})`,
  }));

  const partItems = stockParts.map((sp) => ({
    value: sp.partId,
    label: `${sp.partNumber} — ${sp.partName} (${t("available")}: ${sp.available})`,
  }));

  const handleWarehouseSearch = useCallback((term: string) => {
    if (warehouseSearchTimer.current)
      clearTimeout(warehouseSearchTimer.current);
    if (!term.trim()) {
      setWarehouseResults([]);
      return;
    }
    warehouseSearchTimer.current = setTimeout(async () => {
      setSearchingWarehouses(true);
      try {
        const { searchWarehouses } = await import(
          "@/services/warehouses.service"
        );
        const results = await searchWarehouses(term);
        setWarehouseResults(results);
      } catch {
        // silent
      } finally {
        setSearchingWarehouses(false);
      }
    }, 300);
  }, []);

  const fetchWarehouseStock = useCallback(
    async (warehouseId: string) => {
      setSearchingParts(true);
      try {
        const { apiGet } = await import("@/services/api-client");
        const data = await apiGet<{ content: WarehouseStock[] }>(
          `/warehouse-stock?warehouseId=${warehouseId}&page=0&size=500`,
        );
        setStockParts(
          data.content
            .filter((s) => s.quantity > 0)
            .map((s) => ({
              partId: s.partId,
              partName: s.partName,
              partNumber: s.partNumber,
              available: s.quantity,
            })),
        );
      } catch {
        setStockParts([]);
      } finally {
        setSearchingParts(false);
      }
    },
    [],
  );

  const handlePartSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      if (partSearchTimer.current) clearTimeout(partSearchTimer.current);
      // Client-side filter since we already have all stock loaded
      partSearchTimer.current = setTimeout(() => {
        // No-op: the SearchableSelect already filters by label client-side
      }, 100);
    },
    [],
  );

  const formik = useFormik({
    initialValues: {
      sourceWarehouseId: transfer?.sourceWarehouseId || "",
      destinationWarehouseId: transfer?.destinationWarehouseId || "",
      transferDate: transfer?.transferDate
        ? transfer.transferDate.substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      notes: transfer?.notes || "",
    },
    validationSchema: Yup.object({
      sourceWarehouseId: Yup.string().required(
        tValidation("sourceWarehouseRequired"),
      ),
      destinationWarehouseId: Yup.string()
        .required(tValidation("destinationWarehouseRequired"))
        .test(
          "not-same",
          t("warehousesMustDiffer"),
          function (value) {
            return value !== this.parent.sourceWarehouseId;
          },
        ),
      transferDate: Yup.string().required(
        tValidation("transferDateRequired"),
      ),
    }),
    onSubmit: async (values) => {
      const validItems = items.filter(
        (item) => item.partId && Number(item.quantity) > 0,
      );
      if (validItems.length === 0) {
        setError(t("atLeastOneItem"));
        return;
      }

      // Check quantities against available stock
      for (const item of validItems) {
        const available = availableByPartId.current.get(item.partId) ?? 0;
        const qty = Number(item.quantity);
        if (qty > available) {
          const part = stockParts.find((sp) => sp.partId === item.partId);
          setError(
            t("exceedsAvailable", {
              part: part ? `${part.partNumber} — ${part.partName}` : item.partId,
              available,
              requested: qty,
            }),
          );
          return;
        }
      }

      setSaving(true);
      setError("");

      try {
        const payload = {
          sourceWarehouseId: values.sourceWarehouseId,
          destinationWarehouseId: values.destinationWarehouseId,
          transferDate: values.transferDate,
          notes: values.notes || undefined,
          items: validItems.map((item) => ({
            partId: item.partId,
            quantity: Number(item.quantity),
          })),
        };

        if (transfer) {
          const { updateStockTransfer } = await import(
            "@/services/stock-transfers.service"
          );
          await updateStockTransfer(transfer.id, payload);
        } else {
          const { createStockTransfer } = await import(
            "@/services/stock-transfers.service"
          );
          await createStockTransfer(payload);
        }

        router.push("/admin/stock/transfers");
        router.refresh();
      } catch {
        setError(t("failedSave"));
      } finally {
        setSaving(false);
      }
    },
  });

  // When source warehouse changes, reload stock and clear selected items
  const sourceWarehouseIdRef = useRef(formik.values.sourceWarehouseId);
  useEffect(() => {
    const sourceId = formik.values.sourceWarehouseId;
    if (sourceId === sourceWarehouseIdRef.current) return;
    sourceWarehouseIdRef.current = sourceId;

    if (sourceId) {
      fetchWarehouseStock(sourceId);
      setItems([{ partId: "", quantity: "" }]);
    } else {
      setStockParts([]);
    }
  }, [formik.values.sourceWarehouseId, fetchWarehouseStock]);

  // Load stock on mount for edit mode
  useEffect(() => {
    if (transfer?.sourceWarehouseId) {
      fetchWarehouseStock(transfer.sourceWarehouseId);
    }
  }, [transfer?.sourceWarehouseId, fetchWarehouseStock]);

  function getItemError(item: TransferItemRow): string | undefined {
    if (!item.partId || !item.quantity) return undefined;
    const qty = Number(item.quantity);
    if (qty <= 0) return undefined;
    const available = availableByPartId.current.get(item.partId);
    if (available !== undefined && qty > available) {
      return t("maxAvailable", { count: available });
    }
    return undefined;
  }

  function addItem() {
    setItems((prev) => [...prev, { partId: "", quantity: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(
    index: number,
    field: keyof TransferItemRow,
    value: string,
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <FormSection title={t("transferDetails")}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SearchableSelect
            label={t("sourceWarehouse")}
            items={warehouseItems}
            value={formik.values.sourceWarehouseId}
            onChange={(value) =>
              formik.setFieldValue("sourceWarehouseId", value)
            }
            onBlur={() => formik.setFieldTouched("sourceWarehouseId")}
            placeholder={t("selectSourceWarehouse")}
            searchPlaceholder={tCommon("search")}
            onSearch={handleWarehouseSearch}
            searching={searchingWarehouses}
            required
            error={
              formik.touched.sourceWarehouseId
                ? formik.errors.sourceWarehouseId
                : undefined
            }
          />
          <SearchableSelect
            label={t("destinationWarehouse")}
            items={warehouseItems}
            value={formik.values.destinationWarehouseId}
            onChange={(value) =>
              formik.setFieldValue("destinationWarehouseId", value)
            }
            onBlur={() => formik.setFieldTouched("destinationWarehouseId")}
            placeholder={t("selectDestinationWarehouse")}
            searchPlaceholder={tCommon("search")}
            onSearch={handleWarehouseSearch}
            searching={searchingWarehouses}
            required
            error={
              formik.touched.destinationWarehouseId
                ? formik.errors.destinationWarehouseId
                : undefined
            }
          />
          <InputGroup
            label={t("transferDate")}
            type="date"
            placeholder=""
            name="transferDate"
            value={formik.values.transferDate}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={
              formik.touched.transferDate
                ? formik.errors.transferDate
                : undefined
            }
          />
        </div>
        <div className="mt-6">
          <label className="text-body-sm font-medium text-dark dark:text-white">
            {t("notes")}
          </label>
          <textarea
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={t("notesPlaceholder")}
            rows={3}
            className="mt-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </FormSection>

      <FormSection title={t("transferItems")}>
        {!formik.values.sourceWarehouseId && (
          <p className="text-body-sm text-dark-6">
            {t("selectSourceFirst")}
          </p>
        )}

        {formik.values.sourceWarehouseId && (
          <div className="space-y-4">
            {items.map((item, index) => {
              const itemError = getItemError(item);
              const available = item.partId
                ? availableByPartId.current.get(item.partId)
                : undefined;

              return (
                <div
                  key={index}
                  className="flex items-end gap-4 rounded-lg border border-stroke p-4 dark:border-dark-3"
                >
                  <div className="flex-1">
                    <SearchableSelect
                      label={t("part")}
                      items={partItems}
                      value={item.partId}
                      onChange={(value) => updateItem(index, "partId", value)}
                      placeholder={t("selectPart")}
                      searchPlaceholder={tCommon("search")}
                      onSearch={handlePartSearch}
                      searching={searchingParts}
                      required
                    />
                  </div>
                  <div className="w-40">
                    <InputGroup
                      label={
                        available !== undefined
                          ? `${t("quantity")} (max: ${available})`
                          : t("quantity")
                      }
                      type="number"
                      placeholder="0"
                      value={item.quantity}
                      handleChange={(e) => {
                        const val = e.target.value;
                        if (available !== undefined && Number(val) > available) {
                          updateItem(index, "quantity", String(available));
                        } else {
                          updateItem(index, "quantity", val);
                        }
                      }}
                      required
                      error={itemError}
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="mb-0.5 rounded-lg border border-red px-3 py-2.5 text-sm text-red hover:bg-red/5"
                    >
                      {tCommon("remove")}
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
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
              {t("addItem")}
            </button>
          </div>
        )}
      </FormSection>

      {error && (
        <div className="rounded-lg bg-red/5 p-4 text-sm text-red">{error}</div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
        >
          {tCommon("cancel")}
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {saving
            ? tCommon("saving")
            : transfer
              ? t("updateTransfer")
              : t("createTransfer")}
        </button>
      </div>
    </form>
  );
}
