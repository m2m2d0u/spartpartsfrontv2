"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import type { Part, Category } from "@/types";

type Props = {
  part?: Part;
  categories: Category[];
};

export function PartForm({ part, categories }: Props) {
  const router = useRouter();
  const isEditing = !!part;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("parts");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const partSchema = Yup.object({
    partNumber: Yup.string()
      .trim()
      .max(50, tVal("partNumberMaxLength", { max: 50 }))
      .required(tVal("partNumberRequired")),
    name: Yup.string()
      .trim()
      .max(200, tVal("partNameMaxLength", { max: 200 }))
      .required(tVal("partNameRequired")),
    shortDescription: Yup.string().max(
      500,
      tVal("shortDescriptionMaxLength", { max: 500 }),
    ),
    description: Yup.string(),
    categoryId: Yup.string(),
    sellingPrice: Yup.number()
      .typeError(tVal("mustBeNumber"))
      .min(0, tVal("cannotBeNegative"))
      .required(tVal("sellingPriceRequired")),
    purchasePrice: Yup.number()
      .typeError(tVal("mustBeNumber"))
      .min(0, tVal("cannotBeNegative"))
      .required(tVal("purchasePriceRequired")),
    minStockLevel: Yup.number()
      .typeError(tVal("mustBeNumber"))
      .min(0, tVal("cannotBeNegative"))
      .integer(tVal("mustBeWholeNumber")),
    published: Yup.boolean(),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      partNumber: part?.partNumber || "",
      name: part?.name || "",
      description: part?.description || "",
      shortDescription: part?.shortDescription || "",
      categoryId: part?.categoryId || "",
      sellingPrice: part?.sellingPrice?.toString() || "",
      purchasePrice: part?.purchasePrice?.toString() || "",
      minStockLevel: part?.minStockLevel?.toString() || "0",
      published: part?.published ?? false,
      notes: part?.notes || "",
    },
    validationSchema: partSchema,
    onSubmit: async (values) => {
      setServerError("");
      const payload = {
        partNumber: values.partNumber,
        name: values.name,
        description: values.description || undefined,
        shortDescription: values.shortDescription || undefined,
        categoryId: values.categoryId || undefined,
        sellingPrice: parseFloat(values.sellingPrice as string),
        purchasePrice: parseFloat(values.purchasePrice as string),
        minStockLevel: parseInt(values.minStockLevel as string) || 0,
        published: values.published,
        notes: values.notes || undefined,
      };

      try {
        if (isEditing) {
          const { updatePart } = await import("@/services/parts.service");
          await updatePart(part.id, payload);
          router.push(`/admin/parts/${part.id}`);
        } else {
          const { createPart } = await import("@/services/parts.service");
          const created = await createPart(payload);
          router.push(`/admin/parts/${created.id}`);
        }
        router.refresh();
      } catch {
        setServerError(t("failedSave"));
      }
    },
  });

  const categoryItems = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  return (
    <FormSection title={isEditing ? t("editPart") : t("newPart")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={t("partNumber")}
            name="partNumber"
            type="text"
            placeholder={t("partNumberPlaceholder")}
            value={formik.values.partNumber}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("partNumber")}
          />
          <InputGroup
            label={t("partName")}
            name="name"
            type="text"
            placeholder={t("partNamePlaceholder")}
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
          />
        </div>

        <InputGroup
          label={t("shortDescription")}
          name="shortDescription"
          type="text"
          placeholder={t("shortDescriptionPlaceholder")}
          value={formik.values.shortDescription}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("shortDescription")}
        />

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("description")}
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder={t("descriptionPlaceholder")}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>

        <Select
          label={t("category")}
          name="categoryId"
          placeholder={t("selectCategory")}
          items={categoryItems}
          value={formik.values.categoryId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("categoryId")}
        />

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            {t("pricing")}
          </h4>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <InputGroup
              label={t("sellingPrice")}
              name="sellingPrice"
              type="number"
              placeholder="0"
              value={formik.values.sellingPrice}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("sellingPrice")}
            />
            <InputGroup
              label={t("purchasePrice")}
              name="purchasePrice"
              type="number"
              placeholder="0"
              value={formik.values.purchasePrice}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("purchasePrice")}
            />
            <InputGroup
              label={t("minStockLevel")}
              name="minStockLevel"
              type="number"
              placeholder="0"
              value={formik.values.minStockLevel}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("minStockLevel")}
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("internalNotes")}
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder={t("internalNotesPlaceholder")}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>

        <Switch
          label={t("publishedLabel")}
          checked={formik.values.published}
          onChange={(checked) => formik.setFieldValue("published", checked)}
        />

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {formik.isSubmitting
              ? tCommon("saving")
              : isEditing
                ? t("updatePart")
                : t("createPart")}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            {tCommon("cancel")}
          </button>
        </div>
      </form>
    </FormSection>
  );
}
