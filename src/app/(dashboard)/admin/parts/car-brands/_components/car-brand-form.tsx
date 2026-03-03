"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { FormSection } from "@/components/FormSection";
import type { CarBrand } from "@/types";

type Props = {
  carBrand?: CarBrand;
};

export function CarBrandForm({ carBrand }: Props) {
  const router = useRouter();
  const isEditing = !!carBrand;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("carBrands");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const schema = Yup.object({
    name: Yup.string()
      .trim()
      .max(100, tVal("nameMaxLength", { max: 100 }))
      .required(tVal("carBrandNameRequired")),
    logoUrl: Yup.string()
      .max(500, tVal("urlMaxLength", { max: 500 }))
      .url(tVal("validUrl"))
      .nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: carBrand?.name || "",
      logoUrl: carBrand?.logoUrl || "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        if (isEditing) {
          const { updateCarBrand } = await import(
            "@/services/car-brands.service"
          );
          await updateCarBrand(carBrand.id, values);
          router.push("/admin/parts/car-brands");
        } else {
          const { createCarBrand } = await import(
            "@/services/car-brands.service"
          );
          await createCarBrand(values);
          router.push("/admin/parts/car-brands");
        }
        router.refresh();
      } catch {
        setServerError(t("failedSave"));
      }
    },
  });

  return (
    <FormSection title={isEditing ? t("editCarBrand") : t("newCarBrand")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <InputGroup
          label={t("brandName")}
          name="name"
          type="text"
          placeholder={t("brandNamePlaceholder")}
          value={formik.values.name}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name ? formik.errors.name : undefined}
        />

        <InputGroup
          label={t("logoUrl")}
          name="logoUrl"
          type="text"
          placeholder={t("logoUrlPlaceholder")}
          value={formik.values.logoUrl}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.logoUrl ? formik.errors.logoUrl : undefined}
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
                ? t("updateCarBrand")
                : t("createCarBrand")}
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
