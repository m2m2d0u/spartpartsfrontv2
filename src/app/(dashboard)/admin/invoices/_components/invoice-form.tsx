"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormSection } from "@/components/FormSection";
import { FormDialog } from "@/components/ui/form-dialog";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { standardFormat } from "@/lib/format-number";
import type {
  Invoice,
  InvoiceTemplate,
  InvoiceStatus,
  Customer,
  Warehouse,
} from "@/types";

type Props = {
  invoice?: Invoice;
  customers: Customer[];
  templates: InvoiceTemplate[];
};

type InvoiceItemRow = {
  partId: string;
  quantity: string;
  unitPrice: string;
  discountPercent: string;
};

type PartOption = { id: string; name: string; partNumber: string; sellingPrice: number };

export function InvoiceForm({ invoice, customers, templates }: Props) {
  const router = useRouter();
  const isEditing = !!invoice;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const t = useTranslations("invoices");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");

  // Line items
  const [items, setItems] = useState<InvoiceItemRow[]>(
    invoice?.items.map((i) => ({
      partId: i.partId,
      quantity: String(i.quantity),
      unitPrice: String(i.unitPrice),
      discountPercent: String(i.discountPercent || 0),
    })) || [{ partId: "", quantity: "", unitPrice: "", discountPercent: "0" }],
  );

  // Parts search
  const [partResults, setPartResults] = useState<PartOption[]>([]);
  const [searchingParts, setSearchingParts] = useState(false);
  const partSearchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Warehouse search
  const [warehouseResults, setWarehouseResults] = useState<Warehouse[]>([]);
  const [searchingWarehouses, setSearchingWarehouses] = useState(false);
  const warehouseSearchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const selectedWarehouseId = useRef(invoice?.sourceWarehouseId || "");

  // Inline customer creation
  const [customerList, setCustomerList] = useState(customers);
  const [createCustomerOpen, setCreateCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerCompany, setNewCustomerCompany] = useState("");
  const [createCustomerLoading, setCreateCustomerLoading] = useState(false);
  const [createCustomerError, setCreateCustomerError] = useState("");

  const customerItems = customerList.map((c) => ({
    value: c.id,
    label: c.name + (c.company ? ` — ${c.company}` : ""),
  }));

  const templateItems = templates.map((tpl) => ({
    value: tpl.id,
    label: tpl.name,
  }));

  const partItems = partResults.map((p) => ({
    value: p.id,
    label: `${p.partNumber} — ${p.name}`,
  }));

  const warehouseItems = warehouseResults.map((w) => ({
    value: w.id,
    label: `${w.name} (${w.code})`,
  }));

  const handlePartSearch = useCallback((term: string) => {
    if (partSearchTimer.current) clearTimeout(partSearchTimer.current);
    if (!term.trim()) {
      setPartResults([]);
      return;
    }
    const warehouseId = selectedWarehouseId.current;
    if (!warehouseId) return;
    partSearchTimer.current = setTimeout(async () => {
      setSearchingParts(true);
      try {
        const { apiGet } = await import("@/services/api-client");
        const data = await apiGet<{
          content: PartOption[];
        }>(
          `/parts/in-warehouse?warehouseId=${encodeURIComponent(warehouseId)}&page=0&size=20&name=${encodeURIComponent(term)}`,
        );
        setPartResults(data.content);
      } catch {
        // silent
      } finally {
        setSearchingParts(false);
      }
    }, 300);
  }, []);

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

  function handleCreateCustomer(searchTerm: string) {
    setNewCustomerName(searchTerm);
    setNewCustomerCompany("");
    setCreateCustomerError("");
    setCreateCustomerOpen(true);
  }

  async function handleSubmitNewCustomer() {
    if (!newCustomerName.trim()) return;
    setCreateCustomerLoading(true);
    setCreateCustomerError("");
    try {
      const { createCustomer } = await import("@/services/customers.service");
      const created = await createCustomer({
        name: newCustomerName.trim(),
        company: newCustomerCompany.trim() || undefined,
      });
      setCustomerList((prev) => [...prev, created]);
      formik.setFieldValue("customerId", created.id);
      setCreateCustomerOpen(false);
      setNewCustomerName("");
      setNewCustomerCompany("");
    } catch {
      setCreateCustomerError(t("failedCreateCustomer"));
    } finally {
      setCreateCustomerLoading(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      invoiceType: invoice?.invoiceType || "STANDARD",
      status: (invoice?.status as string) || "DRAFT",
      customerId: invoice?.customerId || "",
      templateId: invoice?.templateId || "",
      issuedDate: invoice?.issuedDate
        ? invoice.issuedDate.substring(0, 10)
        : new Date().toISOString().substring(0, 10),
      dueDate: invoice?.dueDate ? invoice.dueDate.substring(0, 10) : "",
      validityDate: invoice?.validityDate
        ? invoice.validityDate.substring(0, 10)
        : "",
      sourceWarehouseId: invoice?.sourceWarehouseId || "",
      notes: invoice?.notes || "",
      internalNotes: invoice?.internalNotes || "",
    },
    validationSchema: Yup.object({
      invoiceType: Yup.string().required(tValidation("required")),
      customerId: Yup.string().required(tValidation("required")),
      templateId: Yup.string().required(tValidation("required")),
      sourceWarehouseId: Yup.string().required(tValidation("required")),
      issuedDate: Yup.string().required(tValidation("required")),
    }),
    onSubmit: async (values) => {
      const validItems = items.filter(
        (item) => item.partId && Number(item.quantity) > 0 && Number(item.unitPrice) >= 0,
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
          discountPercent: Number(item.discountPercent) || undefined,
        }));

        if (isEditing) {
          const { updateInvoice } = await import(
            "@/services/invoices.service"
          );
          await updateInvoice(invoice.id, {
            templateId: values.templateId,
            issuedDate: values.issuedDate,
            dueDate: values.dueDate || undefined,
            validityDate: values.validityDate || undefined,
            sourceWarehouseId: values.sourceWarehouseId,
            notes: values.notes || undefined,
            internalNotes: values.internalNotes || undefined,
            items: mappedItems,
          });
        } else {
          const { createInvoice } = await import(
            "@/services/invoices.service"
          );
          await createInvoice({
            invoiceType: values.invoiceType as "PROFORMA" | "STANDARD" | "DEPOSIT",
            status: values.status as InvoiceStatus,
            customerId: values.customerId,
            templateId: values.templateId,
            issuedDate: values.issuedDate,
            dueDate: values.dueDate || undefined,
            validityDate: values.validityDate || undefined,
            sourceWarehouseId: values.sourceWarehouseId,
            notes: values.notes || undefined,
            internalNotes: values.internalNotes || undefined,
            items: mappedItems,
          });
        }

        router.push("/admin/invoices");
        router.refresh();
      } catch {
        setError(t("failedSave"));
      } finally {
        setSaving(false);
      }
    },
  });

  // Item helpers
  function addItem() {
    setItems((prev) => [
      ...prev,
      { partId: "", quantity: "", unitPrice: "", discountPercent: "0" },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(
    index: number,
    field: keyof InvoiceItemRow,
    value: string,
  ) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        // Auto-fill unitPrice when a part is selected
        if (field === "partId" && value) {
          const selectedPart = partResults.find((p) => p.id === value);
          if (selectedPart) {
            updated.unitPrice = String(selectedPart.sellingPrice);
          }
          if (!updated.quantity) {
            updated.quantity = "1";
          }
        }
        return updated;
      }),
    );
  }

  // Calculate line total for display
  function lineTotal(item: InvoiceItemRow): number {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const disc = Number(item.discountPercent) || 0;
    const gross = qty * price;
    return gross - (gross * disc) / 100;
  }

  const grandTotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Invoice Details */}
      <FormSection
        title={t("invoiceDetails")}
        description={t("invoiceDetailsDesc")}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!isEditing && (
            <Select
              label={t("invoiceType")}
              items={[
                { value: "STANDARD", label: t("type_STANDARD") },
                { value: "PROFORMA", label: t("type_PROFORMA") },
                { value: "DEPOSIT", label: t("type_DEPOSIT") },
              ]}
              value={formik.values.invoiceType}
              onChange={(e) =>
                formik.setFieldValue("invoiceType", e.target.value)
              }
              required
            />
          )}
          {!isEditing && (
            <Select
              label={t("invoiceStatus")}
              items={[
                { value: "DRAFT", label: t("status_DRAFT") },
                { value: "SENT", label: t("status_SENT") },
                { value: "PAID", label: t("status_PAID") },
                { value: "PARTIALLY_PAID", label: t("status_PARTIALLY_PAID") },
                { value: "OVERDUE", label: t("status_OVERDUE") },
                { value: "CANCELLED", label: t("status_CANCELLED") },
                { value: "ACCEPTED", label: t("status_ACCEPTED") },
                { value: "EXPIRED", label: t("status_EXPIRED") },
              ]}
              value={formik.values.status}
              onChange={(e) =>
                formik.setFieldValue("status", e.target.value)
              }
              required
            />
          )}
          {!isEditing && (
            <SearchableSelect
              label={t("customer")}
              items={customerItems}
              value={formik.values.customerId}
              onChange={(value) => formik.setFieldValue("customerId", value)}
              onBlur={() => formik.setFieldTouched("customerId")}
              placeholder={t("selectCustomer")}
              searchPlaceholder={tCommon("search")}
              required
              error={
                formik.touched.customerId
                  ? formik.errors.customerId
                  : undefined
              }
              onCreateNew={handleCreateCustomer}
              createNewLabel={(term) => t("createNewCustomer", { name: term })}
            />
          )}
          <Select
            label={t("template")}
            items={templateItems}
            value={formik.values.templateId}
            onChange={(e) =>
              formik.setFieldValue("templateId", e.target.value)
            }
            required
            placeholder={t("selectTemplate")}
          />
          <InputGroup
            label={t("issuedDate")}
            type="date"
            placeholder=""
            name="issuedDate"
            value={formik.values.issuedDate}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={
              formik.touched.issuedDate ? formik.errors.issuedDate : undefined
            }
          />
          <InputGroup
            label={t("dueDate")}
            type="date"
            placeholder=""
            name="dueDate"
            value={formik.values.dueDate}
            handleChange={formik.handleChange}
          />
          <InputGroup
            label={t("validityDate")}
            type="date"
            placeholder=""
            name="validityDate"
            value={formik.values.validityDate}
            handleChange={formik.handleChange}
          />
          <SearchableSelect
            label={t("sourceWarehouse")}
            items={warehouseItems}
            value={formik.values.sourceWarehouseId}
            onChange={(value) => {
              formik.setFieldValue("sourceWarehouseId", value);
              selectedWarehouseId.current = value;
              // Clear parts & items when warehouse changes
              setPartResults([]);
              setItems([
                { partId: "", quantity: "", unitPrice: "", discountPercent: "0" },
              ]);
            }}
            onBlur={() => formik.setFieldTouched("sourceWarehouseId")}
            placeholder={t("selectWarehouse")}
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
        </div>
      </FormSection>

      {/* Invoice Items */}
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
                  placeholder={
                    formik.values.sourceWarehouseId
                      ? t("selectPart")
                      : t("selectWarehouseFirst")
                  }
                  searchPlaceholder={tCommon("search")}
                  onSearch={handlePartSearch}
                  searching={searchingParts}
                  disabled={!formik.values.sourceWarehouseId}
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
              <div className="w-24">
                <InputGroup
                  label={t("discountPercent")}
                  type="number"
                  placeholder="0"
                  value={item.discountPercent}
                  handleChange={(e) =>
                    updateItem(index, "discountPercent", e.target.value)
                  }
                />
              </div>
              <div className="w-32">
                <p className="mb-3 text-body-sm font-medium text-dark dark:text-white">
                  {t("lineTotal")}
                </p>
                <p className="py-3 font-medium text-dark dark:text-white">
                  {standardFormat(lineTotal(item))}
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
                {standardFormat(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Notes */}
      <FormSection title={t("notes")}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              {t("publicNotes")}
            </label>
            <textarea
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              placeholder={t("publicNotesPlaceholder")}
              rows={3}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              {t("internalNotes")}
            </label>
            <textarea
              name="internalNotes"
              value={formik.values.internalNotes}
              onChange={formik.handleChange}
              placeholder={t("internalNotesPlaceholder")}
              rows={3}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
        </div>
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
              ? t("updateInvoice")
              : t("createInvoice")}
        </button>
      </div>

      {/* Quick create customer dialog */}
      <FormDialog
        open={createCustomerOpen}
        onClose={() => {
          setCreateCustomerOpen(false);
          setCreateCustomerError("");
        }}
        onSubmit={handleSubmitNewCustomer}
        title={t("quickCreateCustomer")}
        submitLabel={tCommon("save")}
        cancelLabel={tCommon("cancel")}
        loading={createCustomerLoading}
      >
        {createCustomerError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318]">
            {createCustomerError}
          </div>
        )}
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("customerNameLabel")} <span className="text-red">*</span>
          </label>
          <input
            type="text"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            placeholder={t("customerNamePlaceholder")}
            autoFocus
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("customerCompanyLabel")}
          </label>
          <input
            type="text"
            value={newCustomerCompany}
            onChange={(e) => setNewCustomerCompany(e.target.value)}
            placeholder={t("customerCompanyPlaceholder")}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </FormDialog>
    </form>
  );
}
