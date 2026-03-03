"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings } from "@/types";

type Props = {
  settings: CompanySettings;
};

export function InvoiceDefaultsForm({ settings }: Props) {
  const d = settings.invoiceDefaults;
  const [form, setForm] = useState({
    proformaPrefix: d.proformaPrefix,
    invoicePrefix: d.invoicePrefix,
    depositPrefix: d.depositPrefix,
    creditNotePrefix: d.creditNotePrefix,
    orderPrefix: d.orderPrefix,
    defaultPaymentTerms: String(d.defaultPaymentTerms),
    defaultProformaValidity: String(d.defaultProformaValidity),
    defaultInvoiceNotes: d.defaultInvoiceNotes,
    sequentialReset: d.sequentialReset,
    defaultInvoiceTemplate: d.defaultInvoiceTemplate,
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
    const { updateCompanySettings } = await import(
      "@/services/company-settings.service"
    );
    await updateCompanySettings({
      invoiceDefaults: {
        proformaPrefix: form.proformaPrefix,
        invoicePrefix: form.invoicePrefix,
        depositPrefix: form.depositPrefix,
        creditNotePrefix: form.creditNotePrefix,
        orderPrefix: form.orderPrefix,
        defaultPaymentTerms: parseInt(form.defaultPaymentTerms) || 30,
        defaultProformaValidity:
          parseInt(form.defaultProformaValidity) || 30,
        defaultInvoiceNotes: form.defaultInvoiceNotes,
        sequentialReset: form.sequentialReset as "yearly" | "continuous",
        defaultInvoiceTemplate: form.defaultInvoiceTemplate,
      },
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <FormSection
      title="Invoice Defaults"
      description="Default prefixes, terms, and templates for invoicing"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <InputGroup
            label="Proforma Prefix"
            name="proformaPrefix"
            type="text"
            placeholder="PRO"
            value={form.proformaPrefix}
            handleChange={handleChange}
          />
          <InputGroup
            label="Invoice Prefix"
            name="invoicePrefix"
            type="text"
            placeholder="FAC"
            value={form.invoicePrefix}
            handleChange={handleChange}
          />
          <InputGroup
            label="Deposit Prefix"
            name="depositPrefix"
            type="text"
            placeholder="ACO"
            value={form.depositPrefix}
            handleChange={handleChange}
          />
          <InputGroup
            label="Credit Note Prefix"
            name="creditNotePrefix"
            type="text"
            placeholder="AVO"
            value={form.creditNotePrefix}
            handleChange={handleChange}
          />
          <InputGroup
            label="Order Prefix"
            name="orderPrefix"
            type="text"
            placeholder="CMD"
            value={form.orderPrefix}
            handleChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <InputGroup
            label="Payment Terms (days)"
            name="defaultPaymentTerms"
            type="number"
            placeholder="30"
            value={form.defaultPaymentTerms}
            handleChange={handleChange}
          />
          <InputGroup
            label="Proforma Validity (days)"
            name="defaultProformaValidity"
            type="number"
            placeholder="30"
            value={form.defaultProformaValidity}
            handleChange={handleChange}
          />
          <Select
            label="Sequential Reset"
            items={[
              { value: "yearly", label: "Reset Yearly" },
              { value: "continuous", label: "Continuous" },
            ]}
            value={form.sequentialReset}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                sequentialReset: e.target.value as "yearly" | "continuous",
              }));
              setSaved(false);
            }}
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
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            placeholder="Default notes to include on invoices..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Defaults"}
          </button>
          {saved && (
            <span className="text-body-sm text-[#027A48]">
              Invoice defaults saved successfully
            </span>
          )}
        </div>
      </form>
    </FormSection>
  );
}
