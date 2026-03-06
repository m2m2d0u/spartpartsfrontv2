"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings, Store } from "@/types";

type Props = {
  store: Store;
  companySettings: CompanySettings;
};

export function StoreOverridesForm({ store, companySettings }: Props) {
  const [saved, setSaved] = useState(false);
  const t = useTranslations("storeOverrides");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

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
      .typeError(tVal("mustBeNumber"))
      .min(0, tVal("cannotBeNegative"))
      .integer(tVal("mustBeWholeNumber"))
      .nullable(),
    defaultProformaValidity: Yup.number()
      .typeError(tVal("mustBeNumber"))
      .min(0, tVal("cannotBeNegative"))
      .integer(tVal("mustBeWholeNumber"))
      .nullable(),
    defaultInvoiceNotes: Yup.string(),
    currencySymbol: Yup.string(),
    currencyPosition: Yup.string(),
    currencyDecimals: Yup.string(),
    thousandsSeparator: Yup.string(),
  });

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
      currencySymbol: store.currencySymbol || "",
      currencyPosition: store.currencyPosition || "",
      currencyDecimals: store.currencyDecimals != null
        ? String(store.currencyDecimals)
        : "",
      thousandsSeparator: store.thousandsSeparator || "",
    },
    validationSchema: overridesSchema,
    onSubmit: async (values) => {
      setSaved(false);
      const { updateStore } = await import("@/services/stores.service");
      await updateStore(store.id, {
        name: store.name,
        code: store.code,
        isActive: store.isActive,
        street: store.street || undefined,
        city: store.city || undefined,
        state: store.state || undefined,
        postalCode: store.postalCode || undefined,
        country: store.country || undefined,
        phone: store.phone || undefined,
        email: store.email || undefined,
        logoUrl: store.logoUrl ?? undefined,
        stampImageUrl: store.stampImageUrl ?? undefined,
        ninea: values.ninea || null,
        rccm: values.rccm || null,
        taxId: values.taxId || null,
        invoicePrefix: values.invoicePrefix || null,
        proformaPrefix: values.proformaPrefix || null,
        depositPrefix: values.depositPrefix || null,
        creditNotePrefix: values.creditNotePrefix || null,
        orderPrefix: values.orderPrefix || null,
        defaultPaymentTerms: values.defaultPaymentTerms
          ? parseInt(values.defaultPaymentTerms)
          : null,
        defaultProformaValidity: values.defaultProformaValidity
          ? parseInt(values.defaultProformaValidity)
          : null,
        defaultInvoiceNotes: values.defaultInvoiceNotes || null,
        currencySymbol: values.currencySymbol || null,
        currencyPosition: values.currencyPosition || null,
        currencyDecimals: values.currencyDecimals
          ? parseInt(values.currencyDecimals)
          : null,
        thousandsSeparator: values.thousandsSeparator || null,
      });
      setSaved(true);
    },
  });

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  return (
    <FormSection
      title={t("title", { storeName: store.name })}
      description={t("description")}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label={t("ninea")}
            name="ninea"
            type="text"
            placeholder={companySettings.ninea || t("nineaPlaceholder")}
            value={formik.values.ninea}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputGroup
            label={t("rccm")}
            name="rccm"
            type="text"
            placeholder={companySettings.rccm || t("rccmPlaceholder")}
            value={formik.values.rccm}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputGroup
            label={t("taxId")}
            name="taxId"
            type="text"
            placeholder={companySettings.taxId || t("taxIdPlaceholder")}
            value={formik.values.taxId}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            {t("invoicePrefixes")}
          </h4>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <InputGroup
              label={t("proforma")}
              name="proformaPrefix"
              type="text"
              placeholder={companySettings.proformaPrefix}
              value={formik.values.proformaPrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputGroup
              label={t("invoice")}
              name="invoicePrefix"
              type="text"
              placeholder={companySettings.invoicePrefix}
              value={formik.values.invoicePrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputGroup
              label={t("deposit")}
              name="depositPrefix"
              type="text"
              placeholder={companySettings.depositPrefix}
              value={formik.values.depositPrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputGroup
              label={t("creditNote")}
              name="creditNotePrefix"
              type="text"
              placeholder={companySettings.creditNotePrefix}
              value={formik.values.creditNotePrefix}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <InputGroup
              label={t("order")}
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
            label={t("paymentTerms")}
            name="defaultPaymentTerms"
            type="number"
            placeholder={String(companySettings.defaultPaymentTerms)}
            value={formik.values.defaultPaymentTerms}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("defaultPaymentTerms")}
          />
          <InputGroup
            label={t("proformaValidity")}
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
            {t("defaultInvoiceNotes")}
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

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            {t("currencySettings")}
          </h4>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <InputGroup
              label={t("currencySymbol")}
              name="currencySymbol"
              type="text"
              placeholder={companySettings.currencySymbol || "FCFA"}
              value={formik.values.currencySymbol}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <Select
              label={t("currencyPosition")}
              items={[
                { value: "", label: t("useDefault") },
                { value: "BEFORE", label: t("beforeAmount") },
                { value: "AFTER", label: t("afterAmount") },
              ]}
              value={formik.values.currencyPosition}
              onChange={(e) => {
                formik.setFieldValue("currencyPosition", e.target.value);
                setSaved(false);
              }}
            />
            <Select
              label={t("currencyDecimals")}
              items={[
                { value: "", label: t("useDefault") },
                { value: "0", label: "0 (1 000)" },
                { value: "2", label: "2 (1 000,00)" },
                { value: "3", label: "3 (1 000,000)" },
              ]}
              value={formik.values.currencyDecimals}
              onChange={(e) => {
                formik.setFieldValue("currencyDecimals", e.target.value);
                setSaved(false);
              }}
            />
            <Select
              label={t("thousandsSeparator")}
              items={[
                { value: "", label: t("useDefault") },
                { value: " ", label: t("separatorSpace") },
                { value: ".", label: t("separatorDot") },
                { value: ",", label: t("separatorComma") },
              ]}
              value={formik.values.thousandsSeparator}
              onChange={(e) => {
                formik.setFieldValue("thousandsSeparator", e.target.value);
                setSaved(false);
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {formik.isSubmitting ? tCommon("saving") : t("saveOverrides")}
          </button>
          {saved && (
            <span className="text-body-sm text-[#027A48]">
              {t("savedSuccess")}
            </span>
          )}
        </div>
      </form>
    </FormSection>
  );
}
