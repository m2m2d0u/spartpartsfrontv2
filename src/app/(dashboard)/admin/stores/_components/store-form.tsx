"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import type { Store } from "@/types";

type Props = {
  store?: Store;
};

export function StoreForm({ store }: Props) {
  const router = useRouter();
  const isEditing = !!store;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("stores");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const storeSchema = Yup.object({
    name: Yup.string().trim().required(tVal("storeNameRequired")),
    code: Yup.string().trim().required(tVal("storeCodeRequired")),
    phone: Yup.string(),
    email: Yup.string().email(tVal("validEmail")),
    isActive: Yup.boolean(),
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    postalCode: Yup.string(),
    country: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: store?.name || "",
      code: store?.code || "",
      phone: store?.phone || "",
      email: store?.email || "",
      isActive: store?.isActive ?? true,
      street: store?.street || "",
      city: store?.city || "",
      state: store?.state || "",
      postalCode: store?.postalCode || "",
      country: store?.country || "Sénégal",
    },
    validationSchema: storeSchema,
    onSubmit: async (values) => {
      setServerError("");
      try {
        if (isEditing) {
          const { updateStore } = await import("@/services/stores.service");
          await updateStore(store.id, { ...values });
          router.push(`/admin/stores/${store.id}`);
        } else {
          const { createStore } = await import("@/services/stores.service");
          const created = await createStore(values);
          router.push(`/admin/stores/${created.id}`);
        }
        router.refresh();
      } catch {
        setServerError(t("failedSave"));
      }
    },
  });

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  return (
    <FormSection title={isEditing ? t("editStore") : t("newStore")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={t("storeName")}
            name="name"
            type="text"
            placeholder={t("storeNamePlaceholder")}
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
          />
          <InputGroup
            label={t("storeCode")}
            name="code"
            type="text"
            placeholder={t("storeCodePlaceholder")}
            value={formik.values.code}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("code")}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={tCommon("phone")}
            name="phone"
            type="text"
            placeholder={tCommon("phonePlaceholder")}
            value={formik.values.phone}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputGroup
            label={tCommon("email")}
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formik.values.email}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("email")}
          />
        </div>

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            {tCommon("address")}
          </h4>
          <div className="space-y-5">
            <InputGroup
              label={tCommon("street")}
              name="street"
              type="text"
              placeholder={tCommon("streetPlaceholder")}
              value={formik.values.street}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InputGroup
                label={tCommon("city")}
                name="city"
                type="text"
                placeholder={tCommon("cityPlaceholder")}
                value={formik.values.city}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={tCommon("stateRegion")}
                name="state"
                type="text"
                placeholder={tCommon("statePlaceholder")}
                value={formik.values.state}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={tCommon("postalCode")}
                name="postalCode"
                type="text"
                placeholder={tCommon("postalCodePlaceholder")}
                value={formik.values.postalCode}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label={tCommon("country")}
                name="country"
                type="text"
                placeholder={tCommon("countryPlaceholder")}
                value={formik.values.country}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>

        <Switch
          label={t("storeIsActive")}
          checked={formik.values.isActive}
          onChange={(checked) => formik.setFieldValue("isActive", checked)}
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
                ? t("updateStore")
                : t("createStore")}
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
