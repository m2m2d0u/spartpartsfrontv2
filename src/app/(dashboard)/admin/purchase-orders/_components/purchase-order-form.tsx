"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormSection } from "@/components/FormSection";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { formatCurrency, type CurrencyFormatOptions } from "@/lib/format-number";
import { PurchaseOrderStatusCode } from "@/types";
import type {
  PurchaseOrder,
  PurchaseOrderStatus,
  Supplier,
  Warehouse,
} from "@/types";

type Props = {
  purchaseOrder?: PurchaseOrder;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  currencyOptions?: CurrencyFormatOptions;
};

type ItemRow = {
  partId: string;
  quantity: string;
  unitPrice: string;
};

type PartOption = {
  id: string;
  name: string;
  partNumber: string;
  sellingPrice: number;
};

export function PurchaseOrderForm({
  purchaseOrder,
  suppliers,
  warehouses,
  currencyOptions,
}: Props) {
  const router = useRouter();
  const isEditing = !!purchaseOrder;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const t = useTranslations("purchaseOrders");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  // Line items
  const [items, setItems] = useState<ItemRow[]>(
    purchaseOrder?.items.map((i) => ({
      partId: i.partId,
      quantity: String(i.quantity),
      unitPrice: String(i.unitPrice),
    })) || [{ partId: "", quantity: "", unitPrice: "" }],
  );

  // Parts search
  const initialParts = useRef<PartOption[]>(
    purchaseOrder?.items.map((i) => ({
      id: i.partId,
      name: i.partName,
      partNumber: i.partNumber,
      sellingPrice: i.unitPrice,
    })) || [],
  );
  const [partResults, setPartResults] = useState<PartOption[]>([]);
  const [searchingParts, setSearchingParts] = useState(false);
  const partSearchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const supplierItems = suppliers.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const warehouseItems = warehouses.map((w) => ({
    value: w.id,
    label: w.code ? `${w.name} (${w.code})` : w.name,
  }));

  const allParts = useMemo(() => {
    const map = new Map<string, PartOption>();
    for (const p of initialParts.current) map.set(p.id, p);
    for (const p of partResults) map.set(p.id, p);
    return Array.from(map.values());
  }, [partResults]);

  const partItems = allParts.map((p) => ({
    value: p.id,
    label: `${p.partNumber} — ${p.name}`,
  }));

  const handlePartSearch = useCallback((term: string) => {
    if (partSearchTimer.current) clearTimeout(partSearchTimer.current);
    if (!term.trim()) {
      setPartResults([]);
      return;
    }
    partSearchTimer.current = setTimeout(async () => {
      setSearchingParts(true);
      try {
        const { apiGet } = await import("@/services/api-client");
        const data = await apiGet<{ content: PartOption[] }>(
          `/parts?page=0&size=20&name=${encodeURIComponent(term)}`,
        );
        setPartResults(data.content);
      } catch {
        // silent
      } finally {
        setSearchingParts(false);
      }
    }, 300);
  }, []);

  const formik = useFormik({
    initialValues: {
      supplierId: purchaseOrder?.supplierId || "",
      status: (purchaseOrder?.status as string) || PurchaseOrderStatusCode.DRAFT,
      orderDate: purchaseOrder?.orderDate
        ? purchaseOrder.orderDate.substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      expectedDeliveryDate: purchaseOrder?.expectedDeliveryDate
        ? purchaseOrder.expectedDeliveryDate.substring(0, 10)
        : "",
      destinationWarehouseId: purchaseOrder?.destinationWarehouseId || "",
      notes: purchaseOrder?.notes || "",
    },
    validationSchema: Yup.object({
      supplierId: Yup.string().required(tVal("required")),
      orderDate: Yup.string().required(tVal("required")),
    }),
    onSubmit: async (values) => {
      const validItems = items.filter(
        (item) =>
          item.partId && Number(item.quantity) > 0 && Number(item.unitPrice) >= 0,
      );
      if (validItems.length === 0) {
        setError(t("atLeastOneItem"));
        return;
      }

      setSaving(true);
      setError("");

      try {
        const mappedItems = validItems.map((item) => ({
          partId: item.partId,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        }));

        if (isEditing) {
          const { updatePurchaseOrder } = await import(
            "@/services/purchase-orders.service"
          );
          await updatePurchaseOrder(purchaseOrder.id, {
            supplierId: values.supplierId,
            status: values.status as PurchaseOrderStatus,
            orderDate: values.orderDate,
            expectedDeliveryDate: values.expectedDeliveryDate || undefined,
            destinationWarehouseId: values.destinationWarehouseId || undefined,
            notes: values.notes || undefined,
            items: mappedItems,
          });
        } else {
          const { createPurchaseOrder } = await import(
            "@/services/purchase-orders.service"
          );
          await createPurchaseOrder({
            supplierId: values.supplierId,
            status: values.status as PurchaseOrderStatus,
            orderDate: values.orderDate,
            expectedDeliveryDate: values.expectedDeliveryDate || undefined,
            destinationWarehouseId: values.destinationWarehouseId || undefined,
            notes: values.notes || undefined,
            items: mappedItems,
          });
        }

        router.push("/admin/purchase-orders");
        router.refresh();
      } catch {
        setError(t("failedSave"));
      } finally {
        setSaving(false);
      }
    },
  });

  function addItem() {
    setItems((prev) => [...prev, { partId: "", quantity: "", unitPrice: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof ItemRow, value: string) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === "partId" && value) {
          const selectedPart = allParts.find((p) => p.id === value);
          if (selectedPart) {
            updated.unitPrice = String(selectedPart.sellingPrice);
            if (!initialParts.current.some((p) => p.id === value)) {
              initialParts.current = [...initialParts.current, selectedPart];
            }
          }
          if (!updated.quantity) {
            updated.quantity = "1";
          }
        }
        return updated;
      }),
    );
  }

  function lineTotal(item: ItemRow): number {
    return (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
  }

  const grandTotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Order Details */}
      <FormSection title={t("orderDetails")} description={t("orderDetailsDesc")}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SearchableSelect
            label={t("supplier")}
            items={supplierItems}
            value={formik.values.supplierId}
            onChange={(value) => formik.setFieldValue("supplierId", value)}
            onBlur={() => formik.setFieldTouched("supplierId")}
            placeholder={t("selectSupplier")}
            searchPlaceholder={tCommon("search")}
            required
            error={
              formik.touched.supplierId ? formik.errors.supplierId : undefined
            }
          />
          {!isEditing && (
            <Select
              label={tCommon("status")}
              items={[
                { value: PurchaseOrderStatusCode.DRAFT, label: t("status_DRAFT") },
                { value: PurchaseOrderStatusCode.SENT, label: t("status_SENT") },
              ]}
              value={formik.values.status}
              onChange={(e) => formik.setFieldValue("status", e.target.value)}
              required
            />
          )}
          <InputGroup
            label={t("orderDate")}
            type="date"
            placeholder=""
            name="orderDate"
            value={formik.values.orderDate}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={
              formik.touched.orderDate ? formik.errors.orderDate : undefined
            }
          />
          <InputGroup
            label={t("expectedDelivery")}
            type="date"
            placeholder=""
            name="expectedDeliveryDate"
            value={formik.values.expectedDeliveryDate}
            handleChange={formik.handleChange}
          />
          <Select
            label={t("destinationWarehouse")}
            items={[
              { value: "", label: t("noWarehouse") },
              ...warehouseItems,
            ]}
            value={formik.values.destinationWarehouseId}
            onChange={(e) =>
              formik.setFieldValue("destinationWarehouseId", e.target.value)
            }
          />
        </div>
      </FormSection>

      {/* Items */}
      <FormSection title={t("items")} description={t("itemsDesc")}>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-end gap-4 rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div className="min-w-[200px] flex-1">
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
              <div className="w-24">
                <InputGroup
                  label={t("quantity")}
                  type="number"
                  placeholder="1"
                  value={item.quantity}
                  handleChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                  required
                />
              </div>
              <div className="w-32">
                <InputGroup
                  label={t("unitPrice")}
                  type="number"
                  placeholder="0.00"
                  value={item.unitPrice}
                  handleChange={(e) =>
                    updateItem(index, "unitPrice", e.target.value)
                  }
                  required
                />
              </div>
              <div className="w-32">
                <p className="mb-3 text-body-sm font-medium text-dark dark:text-white">
                  {t("lineTotal")}
                </p>
                <p className="py-3 font-medium text-dark dark:text-white">
                  {formatCurrency(lineTotal(item), currencyOptions)}
                </p>
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
          ))}

          <div className="flex items-center justify-between">
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
            <div className="text-right">
              <span className="text-body-sm text-dark-6">{t("totalAmount")}:</span>{" "}
              <span className="text-lg font-semibold text-dark dark:text-white">
                {formatCurrency(grandTotal, currencyOptions)}
              </span>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Notes */}
      <FormSection title={t("notes")}>
        <textarea
          name="notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          placeholder={t("notesPlaceholder")}
          rows={3}
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
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
            : isEditing
              ? t("updateOrder")
              : t("createPurchaseOrder")}
        </button>
      </div>
    </form>
  );
}
