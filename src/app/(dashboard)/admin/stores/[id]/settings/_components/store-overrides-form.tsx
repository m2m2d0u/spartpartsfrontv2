"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputGroup from "@/components/FormElements/InputGroup";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings, Store } from "@/types";

type Props = {
  store: Store;
  companySettings: CompanySettings;
};

const overridesSchema = Yup.object({
  ninea: Yup.string(),
  rccm: Yup.string(),
  taxId: Yup.string(),
  invoicePrefix: Yup.string(),
  proformaPrefix: Yup.string(),
  depositPrefix: Yup.string(),
  creditNotePrefix: Yup.string(),
  orderPrefix: Yup.string(),
  defaultPaymentTerms: Yup.number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .integer("Must be a whole number")
    .nullable(),
  defaultProformaValidity: Yup.number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .integer("Must be a whole number")
    .nullable(),
  defaultInvoiceNotes: Yup.string(),
});

export function StoreOverridesForm({ store, companySettings }: Props) {
  const [saved, setSaved] = useState(false);

  const formik = useFormik({
    initialValues: {
      ninea: store.ninea || "",
      rccm: store.rccm || "",
      taxId: store.taxId || "",
      invoicePrefix: store.invoicePrefix || "",
      proformaPrefix: store.proformaPrefix || "",
      depositPrefix: store.depositPrefix || "",
      creditNotePrefix: store.creditNotePrefix || "",
      orderPrefix: store.orderPrefix || "",
      defaultPaymentTerms:
        store.defaultPaymentTerms != null
          ? String(store.defaultPaymentTerms)
          : "",
      defaultProformaValidity:
        store.defaultProformaValidity != null
          ? String(store.defaultProformaValidity)
          : "",
      defaultInvoiceNotes: store.defaultInvoiceNotes || "",
    },
    validationSchema: overridesSchema,
    onSubmit: async (values) => {
      setSaved(false);
      const { updateStore } = await import("@/services/stores.service");
      await updateStore(store.id, {
        name: store.name,
        code: store.code,
        isActive: store.isActive,
        ninea: values.ninea || undefined,
        rccm: values.rccm || undefined,
        taxId: values.taxId || undefined,
        invoicePrefix: values.invoicePrefix || undefined,
        proformaPrefix: values.proformaPrefix || undefined,
        depositPrefix: values.depositPrefix || undefined,
        creditNotePrefix: values.creditNotePrefix || undefined,
        orderPrefix: values.orderPrefix || undefined,
        defaultPaymentTerms: values.defaultPaymentTerms
          ? parseInt(values.defaultPaymentTerms)
          : undefined,
        defaultProformaValidity: values.defaultProformaValidity
          ? parseInt(values.defaultProformaValidity)
          : undefined,
        defaultInvoiceNotes: values.defaultInvoiceNotes || undefined,
      });
      setSaved(true);
    },
  });

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  return (
    <FormSection
      title={`Store Overrides — ${store.name}`}
      description="Leave fields empty to use company defaults. Current company defaults are shown as placeholders."
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label="NINEA"
            name="ninea"
            type="text"
            placeholder={companySettings.ninea || "Company NINEA"}
            value={formik.values.ninea}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputGroup
            label="RCCM"
            name="rccm"
            type="text"
            placeholder={companySettings.rccm || "Company RCCM"}
            value={formik.values.rccm}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputGroup
            label="Tax ID"
            name="taxId"
            type="text"
            placeholder={companySettings.taxId || "Company Tax ID"}
            value={formik.values.taxId}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
              placeholder={companySettings.proformaPrefix}
              value={formik.values.proformaPrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputGroup
              label="Invoice"
              name="invoicePrefix"
              type="text"
              placeholder={companySettings.invoicePrefix}
              value={formik.values.invoicePrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputGroup
              label="Deposit"
              name="depositPrefix"
              type="text"
              placeholder={companySettings.depositPrefix}
              value={formik.values.depositPrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputGroup
              label="Credit Note"
              name="creditNotePrefix"
              type="text"
              placeholder={companySettings.creditNotePrefix}
              value={formik.values.creditNotePrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputGroup
              label="Order"
              name="orderPrefix"
              type="text"
              placeholder={companySettings.orderPrefix}
              value={formik.values.orderPrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Payment Terms (days)"
            name="defaultPaymentTerms"
            type="number"
            placeholder={String(companySettings.defaultPaymentTerms)}
            value={formik.values.defaultPaymentTerms}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("defaultPaymentTerms")}
          />
          <InputGroup
            label="Proforma Validity (days)"
            name="defaultProformaValidity"
            type="number"
            placeholder={String(companySettings.defaultProformaValidity)}
            value={formik.values.defaultProformaValidity}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("defaultProformaValidity")}
          />
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Default Invoice Notes
          </label>
          <textarea
            name="defaultInvoiceNotes"
            value={formik.values.defaultInvoiceNotes}
            onChange={(e) => {
              formik.handleChange(e);
              setSaved(false);
            }}
            onBlur={formik.handleBlur}
            rows={3}
            placeholder={companySettings.defaultInvoiceNotes}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Saving..." : "Save Overrides"}
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
