"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { FormSection } from "@/components/FormSection";
import type { Category } from "@/types";

type Props = {
  category?: Category;
};

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const isEditing = !!category;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("categories");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const categorySchema = Yup.object({
    name: Yup.string()
      .trim()
      .max(100, tVal("nameMaxLength", { max: 100 }))
      .required(tVal("categoryNameRequired")),
    description: Yup.string(),
    imageUrl: Yup.string()
      .max(500, tVal("urlMaxLength", { max: 500 }))
      .url(tVal("validUrl"))
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
      imageUrl: category?.imageUrl || "",
    },
    validationSchema: categorySchema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        if (isEditing) {
          const { updateCategory } = await import(
            "@/services/categories.service"
          );
          await updateCategory(category.id, values);
          router.push("/admin/parts/categories");
        } else {
          const { createCategory } = await import(
            "@/services/categories.service"
          );
          await createCategory(values);
          router.push("/admin/parts/categories");
        }
        router.refresh();
      } catch {
        setServerError(t("failedSave"));
      }
    },
  });

  return (
    <FormSection title={isEditing ? t("editCategory") : t("newCategory")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <InputGroup
          label={t("categoryName")}
          name="name"
          type="text"
          placeholder={t("categoryNamePlaceholder")}
          value={formik.values.name}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name ? formik.errors.name : undefined}
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

        <InputGroup
          label={t("imageUrl")}
          name="imageUrl"
          type="text"
          placeholder={t("imageUrlPlaceholder")}
          value={formik.values.imageUrl}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.imageUrl ? formik.errors.imageUrl : undefined}
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
                ? t("updateCategory")
                : t("createCategory")}
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
