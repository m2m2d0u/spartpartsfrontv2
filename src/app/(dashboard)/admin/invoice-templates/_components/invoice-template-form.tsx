"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import { UploadIcon } from "@/assets/icons";
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

/** Image field definition for the 6 template images */
type ImageField = {
  key: string;
  urlField: keyof InvoiceTemplate;
  /** backend endpoint path segment for base64 retrieval */
  endpoint:
    | "logo"
    | "stamp"
    | "header-image"
    | "footer-image"
    | "signature"
    | "watermark";
};

const IMAGE_FIELDS: ImageField[] = [
  { key: "logo", urlField: "logoUrl", endpoint: "logo" },
  { key: "stamp", urlField: "stampImageUrl", endpoint: "stamp" },
  {
    key: "headerImage",
    urlField: "headerImageUrl",
    endpoint: "header-image",
  },
  {
    key: "footerImage",
    urlField: "footerImageUrl",
    endpoint: "footer-image",
  },
  { key: "signature", urlField: "signatureImageUrl", endpoint: "signature" },
  { key: "watermark", urlField: "watermarkImageUrl", endpoint: "watermark" },
];

/** Reusable drag-and-drop file upload zone */
function ImageUploadZone({
  label,
  previewUrl,
  onFileChange,
  onRemove,
  accept = "image/png, image/jpg, image/jpeg",
  hint,
}: {
  label: string;
  previewUrl: string | null;
  onFileChange: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileChange(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
    e.target.value = "";
  }

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
      </label>

      {previewUrl ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={label}
            className="h-32 max-w-[200px] rounded-lg border border-stroke object-contain dark:border-dark-3"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red text-xs text-white hover:bg-red/80"
          >
            &times;
          </button>
        </div>
      ) : (
        <div
          className={`relative rounded-xl border border-dashed ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            hidden
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
          >
            <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
              <UploadIcon />
            </div>
            <p className="mt-2.5 text-body-sm font-medium">
              <span className="text-primary">Click to upload</span> or drag and
              drop
            </p>
            {hint && <p className="mt-1 text-body-xs">{hint}</p>}
          </button>
        </div>
      )}
    </div>
  );
}

export function InvoiceTemplateForm({ template }: Props) {
  const router = useRouter();
  const isEditing = !!template;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const t = useTranslations("invoiceTemplates");
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");

  // ── File state for the 6 image fields ──
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string | null>>({});
  const [removed, setRemoved] = useState<Record<string, boolean>>({});

  // Load existing images as base64 previews when editing
  useEffect(() => {
    if (!template) return;
    let cancelled = false;
    const templateId = template.id;

    // Determine which images exist
    const fieldsToLoad = IMAGE_FIELDS.filter((f) => !!template[f.urlField]);
    if (fieldsToLoad.length === 0) return;

    async function loadPreviews() {
      const { getTemplateImage } = await import(
        "@/services/invoice-templates.service"
      );
      const results = await Promise.all(
        fieldsToLoad.map((f) =>
          getTemplateImage(templateId, f.endpoint).catch(() => null),
        ),
      );
      if (cancelled) return;

      const newPreviews: Record<string, string | null> = {};
      fieldsToLoad.forEach((f, i) => {
        const img = results[i];
        if (img?.base64) {
          newPreviews[f.key] = `data:image/png;base64,${img.base64}`;
        }
      });
      setPreviews((prev) => ({ ...prev, ...newPreviews }));
    }

    loadPreviews();
    return () => {
      cancelled = true;
    };
  }, [template]);

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
        // Build the JSON payload, preserving existing image URLs unless removed
        const payload = {
          name: values.name,
          description: values.description || undefined,
          isDefault: values.isDefault,
          primaryColor: values.primaryColor,
          accentColor: values.accentColor,
          fontFamily: values.fontFamily,
          design: values.design as InvoiceDesign,
          headerLayout: values.headerLayout,
          logoUrl: removed.logo
            ? undefined
            : (template?.logoUrl ?? undefined),
          headerImageUrl: removed.headerImage
            ? undefined
            : (template?.headerImageUrl ?? undefined),
          footerImageUrl: removed.footerImage
            ? undefined
            : (template?.footerImageUrl ?? undefined),
          stampImageUrl: removed.stamp
            ? undefined
            : (template?.stampImageUrl ?? undefined),
          signatureImageUrl: removed.signature
            ? undefined
            : (template?.signatureImageUrl ?? undefined),
          watermarkImageUrl: removed.watermark
            ? undefined
            : (template?.watermarkImageUrl ?? undefined),
          showNinea: values.showNinea,
          showRccm: values.showRccm,
          showTaxId: values.showTaxId,
          showWarehouseAddress: values.showWarehouseAddress,
          showCustomerTaxId: values.showCustomerTaxId,
          showPaymentTerms: values.showPaymentTerms,
          showDiscountColumn: values.showDiscountColumn,
          defaultNotes: values.defaultNotes || undefined,
        };

        // Collect files
        const templateFiles = {
          logo: files.logo || null,
          stamp: files.stamp || null,
          headerImage: files.headerImage || null,
          footerImage: files.footerImage || null,
          signature: files.signature || null,
          watermark: files.watermark || null,
        };

        const hasFiles = Object.values(templateFiles).some(Boolean);

        if (isEditing) {
          if (hasFiles) {
            const { updateInvoiceTemplateWithFiles } = await import(
              "@/services/invoice-templates.service"
            );
            await updateInvoiceTemplateWithFiles(
              template.id,
              payload,
              templateFiles,
            );
          } else {
            const { updateInvoiceTemplate } = await import(
              "@/services/invoice-templates.service"
            );
            await updateInvoiceTemplate(template.id, payload);
          }
        } else {
          if (hasFiles) {
            const { createInvoiceTemplateWithFiles } = await import(
              "@/services/invoice-templates.service"
            );
            await createInvoiceTemplateWithFiles(payload, templateFiles);
          } else {
            const { createInvoiceTemplate } = await import(
              "@/services/invoice-templates.service"
            );
            await createInvoiceTemplate(payload);
          }
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

  /** Translation key map for image labels */
  const imageLabels: Record<string, string> = {
    logo: t("logoUrl"),
    stamp: t("stampImageUrl"),
    headerImage: t("headerImageUrl"),
    footerImage: t("footerImageUrl"),
    signature: t("signatureImageUrl"),
    watermark: t("watermarkImageUrl"),
  };

  function handleFileChange(key: string, file: File) {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    setRemoved((prev) => ({ ...prev, [key]: false }));
  }

  function handleFileRemove(key: string) {
    setFiles((prev) => ({ ...prev, [key]: null }));
    setPreviews((prev) => ({ ...prev, [key]: null }));
    setRemoved((prev) => ({ ...prev, [key]: true }));
  }

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
            onChange={(e) => formik.setFieldValue("design", e.target.value)}
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

      {/* Images — file upload zones */}
      <FormSection title={t("images")} description={t("imagesDesc")}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {IMAGE_FIELDS.map((field) => (
            <ImageUploadZone
              key={field.key}
              label={imageLabels[field.key]}
              previewUrl={previews[field.key] ?? null}
              onFileChange={(file) => handleFileChange(field.key, file)}
              onRemove={() => handleFileRemove(field.key)}
              hint="PNG, JPG or JPEG"
            />
          ))}
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
