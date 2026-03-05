"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { FormSection } from "@/components/FormSection";
import type { Supplier } from "@/types";

type Props = {
  supplier?: Supplier;
};

export function SupplierForm({ supplier }: Props) {
  const router = useRouter();
  const isEditing = !!supplier;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("suppliers");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const supplierSchema = Yup.object({
    name: Yup.string().trim().required(tVal("nameRequired")),
    contactPerson: Yup.string(),
    email: Yup.string().email(tVal("emailInvalid")),
    phone: Yup.string(),
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    postalCode: Yup.string(),
    country: Yup.string(),
    notes: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: supplier?.name || "",
      contactPerson: supplier?.contactPerson || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      street: supplier?.street || "",
      city: supplier?.city || "",
      state: supplier?.state || "",
      postalCode: supplier?.postalCode || "",
      country: supplier?.country || "Sénégal",
      notes: supplier?.notes || "",
    },
    validationSchema: supplierSchema,
    onSubmit: async (values) => {
      setServerError("");
      const payload = {
        name: values.name,
        contactPerson: values.contactPerson || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        street: values.street || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        postalCode: values.postalCode || undefined,
        country: values.country || undefined,
        notes: values.notes || undefined,
      };

      try {
        if (isEditing) {
          const { updateSupplier } = await import(
            "@/services/suppliers.service"
          );
          await updateSupplier(supplier.id, payload);
          router.push(`/admin/suppliers/${supplier.id}`);
        } else {
          const { createSupplier } = await import(
            "@/services/suppliers.service"
          );
          const created = await createSupplier(payload);
          router.push(`/admin/suppliers/${created.id}`);
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
    <FormSection
      title={isEditing ? t("editSupplier") : t("newSupplier")}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={t("name")}
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
          />
          <InputGroup
            label={t("contactPerson")}
            name="contactPerson"
            type="text"
            placeholder={t("contactPersonPlaceholder")}
            value={formik.values.contactPerson}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          <InputGroup
            label={tCommon("phone")}
            name="phone"
            type="text"
            placeholder={tCommon("phonePlaceholder")}
            value={formik.values.phone}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
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

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            {t("notes")}
          </label>
          <textarea
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            placeholder={t("notesPlaceholder")}
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
                ? t("updateSupplier")
                : t("createSupplier")}
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
