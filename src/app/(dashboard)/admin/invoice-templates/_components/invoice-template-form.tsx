"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import type { InvoiceTemplate, InvoiceDesign } from "@/types";

type Props = {
  template?: InvoiceTemplate;
};

const DESIGN_OPTIONS: { value: InvoiceDesign; label: string }[] = [
  { value: "CLASSIC", label: "Classic" },
  { value: "MODERN", label: "Modern" },
  { value: "ELEGANT", label: "Elegant" },
  { value: "COMPACT", label: "Compact" },
  { value: "PROFESSIONAL", label: "Professional" },
];

const FONT_OPTIONS = [
  { value: "Helvetica", label: "Helvetica" },
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
];

const HEADER_LAYOUT_OPTIONS = [
  { value: "LOGO_LEFT", label: "Logo Left" },
  { value: "LOGO_CENTER", label: "Logo Center" },
  { value: "LOGO_RIGHT", label: "Logo Right" },
];

export function InvoiceTemplateForm({ template }: Props) {
  const router = useRouter();
  const isEditing = !!template;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const t = useTranslations("invoiceTemplates");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");

  const formik = useFormik({
    initialValues: {
      name: template?.name || "",
      description: template?.description || "",
      isDefault: template?.isDefault || false,
      primaryColor: template?.primaryColor || "#000000",
      accentColor: template?.accentColor || "#4F46E5",
      fontFamily: template?.fontFamily || "Helvetica",
      design: template?.design || "CLASSIC",
      headerLayout: template?.headerLayout || "LOGO_LEFT",
      logoUrl: template?.logoUrl || "",
      headerImageUrl: template?.headerImageUrl || "",
      footerImageUrl: template?.footerImageUrl || "",
      stampImageUrl: template?.stampImageUrl || "",
      signatureImageUrl: template?.signatureImageUrl || "",
      watermarkImageUrl: template?.watermarkImageUrl || "",
      showNinea: template?.showNinea ?? true,
      showRccm: template?.showRccm ?? true,
      showTaxId: template?.showTaxId ?? true,
      showWarehouseAddress: template?.showWarehouseAddress ?? false,
      showCustomerTaxId: template?.showCustomerTaxId ?? true,
      showPaymentTerms: template?.showPaymentTerms ?? true,
      showDiscountColumn: template?.showDiscountColumn ?? true,
      defaultNotes: template?.defaultNotes || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(tValidation("required")),
    }),
    onSubmit: async (values) => {
      setSaving(true);
      setError("");

      try {
        const payload = {
          name: values.name,
          description: values.description || undefined,
          isDefault: values.isDefault,
          primaryColor: values.primaryColor,
          accentColor: values.accentColor,
          fontFamily: values.fontFamily,
          design: values.design as InvoiceDesign,
          headerLayout: values.headerLayout,
          logoUrl: values.logoUrl || undefined,
          headerImageUrl: values.headerImageUrl || undefined,
          footerImageUrl: values.footerImageUrl || undefined,
          stampImageUrl: values.stampImageUrl || undefined,
          signatureImageUrl: values.signatureImageUrl || undefined,
          watermarkImageUrl: values.watermarkImageUrl || undefined,
          showNinea: values.showNinea,
          showRccm: values.showRccm,
          showTaxId: values.showTaxId,
          showWarehouseAddress: values.showWarehouseAddress,
          showCustomerTaxId: values.showCustomerTaxId,
          showPaymentTerms: values.showPaymentTerms,
          showDiscountColumn: values.showDiscountColumn,
          defaultNotes: values.defaultNotes || undefined,
        };

        if (isEditing) {
          const { updateInvoiceTemplate } = await import(
            "@/services/invoice-templates.service"
          );
          await updateInvoiceTemplate(template.id, payload);
        } else {
          const { createInvoiceTemplate } = await import(
            "@/services/invoice-templates.service"
          );
          await createInvoiceTemplate(payload);
        }

        router.push("/admin/invoice-templates");
        router.refresh();
      } catch {
        setError(t("failedSave"));
      } finally {
        setSaving(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* General Info */}
      <FormSection title={t("generalInfo")} description={t("generalInfoDesc")}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputGroup
            label={t("name")}
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name ? formik.errors.name : undefined}
          />
          <div className="flex items-end pb-1">
            <Switch
              label={t("default")}
              checked={formik.values.isDefault}
              onChange={(checked) => formik.setFieldValue("isDefault", checked)}
            />
          </div>
        </div>
        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("description")}
          </label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder={t("descriptionPlaceholder")}
            rows={2}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </FormSection>

      {/* Appearance */}
      <FormSection title={t("appearance")} description={t("appearanceDesc")}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              {t("primaryColor")}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primaryColor"
                value={formik.values.primaryColor}
                onChange={formik.handleChange}
                className="size-10 cursor-pointer rounded border border-stroke dark:border-dark-3"
              />
              <span className="text-sm text-dark dark:text-white">
                {formik.values.primaryColor}
              </span>
            </div>
          </div>
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              {t("accentColor")}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="accentColor"
                value={formik.values.accentColor}
                onChange={formik.handleChange}
                className="size-10 cursor-pointer rounded border border-stroke dark:border-dark-3"
              />
              <span className="text-sm text-dark dark:text-white">
                {formik.values.accentColor}
              </span>
            </div>
          </div>
          <Select
            label={t("font")}
            items={FONT_OPTIONS}
            value={formik.values.fontFamily}
            onChange={(e) => formik.setFieldValue("fontFamily", e.target.value)}
          />
          <Select
            label={t("design")}
            items={DESIGN_OPTIONS.map((d) => ({
              value: d.value,
              label: t(`design_${d.value}`),
            }))}
            value={formik.values.design}
            onChange={(e) =>
              formik.setFieldValue("design", e.target.value)
            }
          />
          <Select
            label={t("headerLayout")}
            items={HEADER_LAYOUT_OPTIONS}
            value={formik.values.headerLayout}
            onChange={(e) =>
              formik.setFieldValue("headerLayout", e.target.value)
            }
          />
        </div>
      </FormSection>

      {/* Images */}
      <FormSection title={t("images")} description={t("imagesDesc")}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputGroup
            label={t("logoUrl")}
            name="logoUrl"
            type="text"
            placeholder="https://..."
            value={formik.values.logoUrl}
            handleChange={formik.handleChange}
          />
          <InputGroup
            label={t("headerImageUrl")}
            name="headerImageUrl"
            type="text"
            placeholder="https://..."
            value={formik.values.headerImageUrl}
            handleChange={formik.handleChange}
          />
          <InputGroup
            label={t("footerImageUrl")}
            name="footerImageUrl"
            type="text"
            placeholder="https://..."
            value={formik.values.footerImageUrl}
            handleChange={formik.handleChange}
          />
          <InputGroup
            label={t("stampImageUrl")}
            name="stampImageUrl"
            type="text"
            placeholder="https://..."
            value={formik.values.stampImageUrl}
            handleChange={formik.handleChange}
          />
          <InputGroup
            label={t("signatureImageUrl")}
            name="signatureImageUrl"
            type="text"
            placeholder="https://..."
            value={formik.values.signatureImageUrl}
            handleChange={formik.handleChange}
          />
          <InputGroup
            label={t("watermarkImageUrl")}
            name="watermarkImageUrl"
            type="text"
            placeholder="https://..."
            value={formik.values.watermarkImageUrl}
            handleChange={formik.handleChange}
          />
        </div>
      </FormSection>

      {/* Display Options */}
      <FormSection
        title={t("displayOptions")}
        description={t("displayOptionsDesc")}
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Switch
            label={t("showNinea")}
            checked={formik.values.showNinea}
            onChange={(checked) => formik.setFieldValue("showNinea", checked)}
          />
          <Switch
            label={t("showRccm")}
            checked={formik.values.showRccm}
            onChange={(checked) => formik.setFieldValue("showRccm", checked)}
          />
          <Switch
            label={t("showTaxId")}
            checked={formik.values.showTaxId}
            onChange={(checked) => formik.setFieldValue("showTaxId", checked)}
          />
          <Switch
            label={t("showWarehouseAddress")}
            checked={formik.values.showWarehouseAddress}
            onChange={(checked) =>
              formik.setFieldValue("showWarehouseAddress", checked)
            }
          />
          <Switch
            label={t("showCustomerTaxId")}
            checked={formik.values.showCustomerTaxId}
            onChange={(checked) =>
              formik.setFieldValue("showCustomerTaxId", checked)
            }
          />
          <Switch
            label={t("showPaymentTerms")}
            checked={formik.values.showPaymentTerms}
            onChange={(checked) =>
              formik.setFieldValue("showPaymentTerms", checked)
            }
          />
          <Switch
            label={t("showDiscountColumn")}
            checked={formik.values.showDiscountColumn}
            onChange={(checked) =>
              formik.setFieldValue("showDiscountColumn", checked)
            }
          />
        </div>
      </FormSection>

      {/* Default Notes */}
      <FormSection title={t("defaultNotes")}>
        <textarea
          name="defaultNotes"
          value={formik.values.defaultNotes}
          onChange={formik.handleChange}
          placeholder={t("defaultNotesPlaceholder")}
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
              ? t("updateTemplate")
              : t("createTemplate")}
        </button>
      </div>
    </form>
  );
}
