"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { SearchableSelect } from "@/components/FormElements/searchable-select";
import { FormSection } from "@/components/FormSection";
import { useLookup } from "@/stores/lookup-store";
import type { CarModel, CarBrand } from "@/types";

type Props = {
  carModel?: CarModel;
  brands: CarBrand[];
};

export function CarModelForm({ carModel, brands }: Props) {
  const router = useRouter();
  const isEditing = !!carModel;
  const [serverError, setServerError] = useState("");
  const { invalidateModels } = useLookup();
  const t = useTranslations("carModels");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const schema = Yup.object({
    name: Yup.string()
      .trim()
      .max(100, tVal("nameMaxLength", { max: 100 }))
      .required(tVal("carModelNameRequired")),
    brandId: Yup.string().required(tVal("brandRequired")),
    yearFrom: Yup.number()
      .nullable()
      .transform((v, o) => (o === "" ? null : v))
      .typeError(tVal("mustBeNumber"))
      .integer(tVal("mustBeWholeNumber")),
    yearTo: Yup.number()
      .nullable()
      .transform((v, o) => (o === "" ? null : v))
      .typeError(tVal("mustBeNumber"))
      .integer(tVal("mustBeWholeNumber")),
  });

  const formik = useFormik({
    initialValues: {
      name: carModel?.name || "",
      brandId: carModel?.brandId || "",
      yearFrom: carModel?.yearFrom ?? ("" as unknown as number),
      yearTo: carModel?.yearTo ?? ("" as unknown as number),
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setServerError("");
      const payload = {
        name: values.name,
        brandId: values.brandId,
        yearFrom: values.yearFrom || undefined,
        yearTo: values.yearTo || undefined,
      };
      try {
        if (isEditing) {
          const { updateCarModel } = await import(
            "@/services/car-models.service"
          );
          await updateCarModel(carModel.id, payload);
          invalidateModels();
          router.push("/admin/parts/car-models");
        } else {
          const { createCarModel } = await import(
            "@/services/car-models.service"
          );
          await createCarModel(payload);
          invalidateModels();
          router.push("/admin/parts/car-models");
        }
        router.refresh();
      } catch {
        setServerError(t("failedSave"));
      }
    },
  });

  return (
    <FormSection title={isEditing ? t("editCarModel") : t("newCarModel")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <InputGroup
          label={t("modelName")}
          name="name"
          type="text"
          placeholder={t("modelNamePlaceholder")}
          value={formik.values.name}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name ? formik.errors.name : undefined}
        />

        <SearchableSelect
          label={t("brand")}
          name="brandId"
          placeholder={t("selectBrand")}
          items={brands.map((b) => ({ value: b.id, label: b.name }))}
          value={formik.values.brandId}
          onChange={(val) => formik.setFieldValue("brandId", val)}
          onBlur={() => formik.setFieldTouched("brandId", true)}
          error={formik.touched.brandId ? formik.errors.brandId : undefined}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label={t("yearFrom")}
            name="yearFrom"
            type="number"
            placeholder={t("yearFromPlaceholder")}
            value={String(formik.values.yearFrom ?? "")}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.yearFrom ? formik.errors.yearFrom : undefined
            }
          />

          <InputGroup
            label={t("yearTo")}
            name="yearTo"
            type="number"
            placeholder={t("yearToPlaceholder")}
            value={String(formik.values.yearTo ?? "")}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.yearTo ? formik.errors.yearTo : undefined}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {formik.isSubmitting
              ? tCommon("saving")
              : isEditing
                ? t("updateCarModel")
                : t("createCarModel")}
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
