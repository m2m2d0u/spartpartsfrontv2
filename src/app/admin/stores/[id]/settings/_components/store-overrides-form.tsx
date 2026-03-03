"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings, Store } from "@/types";

type Props = {
  store: Store;
  companySettings: CompanySettings;
};

export function StoreOverridesForm({ store, companySettings }: Props) {
  const cd = companySettings.invoiceDefaults;

  const [form, setForm] = useState({
    ninea: store.ninea || "",
    rccm: store.rccm || "",
    taxId: store.taxId || "",
    invoicePrefix: store.invoicePrefix || "",
    proformaPrefix: store.proformaPrefix || "",
    depositPrefix: store.depositPrefix || "",
    creditNotePrefix: store.creditNotePrefix || "",
    orderPrefix: store.orderPrefix || "",
    defaultPaymentTerms: store.defaultPaymentTerms != null ? String(store.defaultPaymentTerms) : "",
    defaultProformaValidity: store.defaultProformaValidity != null ? String(store.defaultProformaValidity) : "",
    defaultInvoiceNotes: store.defaultInvoiceNotes || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { updateStore } = await import("@/services/stores.service");
    await updateStore(store.id, {
      ninea: form.ninea || null,
      rccm: form.rccm || null,
      taxId: form.taxId || null,
      invoicePrefix: form.invoicePrefix || null,
      proformaPrefix: form.proformaPrefix || null,
      depositPrefix: form.depositPrefix || null,
      creditNotePrefix: form.creditNotePrefix || null,
      orderPrefix: form.orderPrefix || null,
      defaultPaymentTerms: form.defaultPaymentTerms
        ? parseInt(form.defaultPaymentTerms)
        : null,
      defaultProformaValidity: form.defaultProformaValidity
        ? parseInt(form.defaultProformaValidity)
        : null,
      defaultInvoiceNotes: form.defaultInvoiceNotes || null,
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <FormSection
      title={`Store Overrides — ${store.name}`}
      description="Leave fields empty to use company defaults. Current company defaults are shown as placeholders."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label="NINEA"
            name="ninea"
            type="text"
            placeholder={companySettings.ninea || "Company NINEA"}
            value={form.ninea}
            handleChange={handleChange}
          />
          <InputGroup
            label="RCCM"
            name="rccm"
            type="text"
            placeholder={companySettings.rccm || "Company RCCM"}
            value={form.rccm}
            handleChange={handleChange}
          />
          <InputGroup
            label="Tax ID"
            name="taxId"
            type="text"
            placeholder={companySettings.taxId || "Company Tax ID"}
            value={form.taxId}
            handleChange={handleChange}
          />
        </div>

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            Invoice Prefixes
          </h4>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <InputGroup
              label="Proforma"
              name="proformaPrefix"
              type="text"
              placeholder={cd.proformaPrefix}
              value={form.proformaPrefix}
              handleChange={handleChange}
            />
            <InputGroup
              label="Invoice"
              name="invoicePrefix"
              type="text"
              placeholder={cd.invoicePrefix}
              value={form.invoicePrefix}
              handleChange={handleChange}
            />
            <InputGroup
              label="Deposit"
              name="depositPrefix"
              type="text"
              placeholder={cd.depositPrefix}
              value={form.depositPrefix}
              handleChange={handleChange}
            />
            <InputGroup
              label="Credit Note"
              name="creditNotePrefix"
              type="text"
              placeholder={cd.creditNotePrefix}
              value={form.creditNotePrefix}
              handleChange={handleChange}
            />
            <InputGroup
              label="Order"
              name="orderPrefix"
              type="text"
              placeholder={cd.orderPrefix}
              value={form.orderPrefix}
              handleChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Payment Terms (days)"
            name="defaultPaymentTerms"
            type="number"
            placeholder={String(cd.defaultPaymentTerms)}
            value={form.defaultPaymentTerms}
            handleChange={handleChange}
          />
          <InputGroup
            label="Proforma Validity (days)"
            name="defaultProformaValidity"
            type="number"
            placeholder={String(cd.defaultProformaValidity)}
            value={form.defaultProformaValidity}
            handleChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Default Invoice Notes
          </label>
          <textarea
            value={form.defaultInvoiceNotes}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                defaultInvoiceNotes: e.target.value,
              }));
              setSaved(false);
            }}
            rows={3}
            placeholder={cd.defaultInvoiceNotes}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Overrides"}
          </button>
          {saved && (
            <span className="text-body-sm text-[#027A48]">
              Store overrides saved successfully
            </span>
          )}
        </div>
      </form>
    </FormSection>
  );
}
