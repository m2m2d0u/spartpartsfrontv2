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
import type { Store, Warehouse } from "@/types";

type Props = {
  warehouse?: Warehouse;
  stores: Store[];
  defaultStoreId?: string;
};

export function WarehouseForm({ warehouse, stores, defaultStoreId }: Props) {
  const router = useRouter();
  const isEditing = !!warehouse;
  const [serverError, setServerError] = useState("");
  const t = useTranslations("warehouses");
  const tCommon = useTranslations("common");
  const tVal = useTranslations("validation");

  const warehouseSchema = Yup.object({
    storeId: Yup.string().required(tVal("storeRequired")),
    name: Yup.string().trim().required(tVal("warehouseNameRequired")),
    code: Yup.string().trim().required(tVal("warehouseCodeRequired")),
    location: Yup.string(),
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    postalCode: Yup.string(),
    country: Yup.string(),
    contactPerson: Yup.string(),
    phone: Yup.string(),
    notes: Yup.string(),
    isActive: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      storeId: warehouse?.storeId || defaultStoreId || "",
      name: warehouse?.name || "",
      code: warehouse?.code || "",
      location: warehouse?.location || "",
      street: warehouse?.street || "",
      city: warehouse?.city || "",
      state: warehouse?.state || "",
      postalCode: warehouse?.postalCode || "",
      country: warehouse?.country || "Sénégal",
      contactPerson: warehouse?.contactPerson || "",
      phone: warehouse?.phone || "",
      notes: warehouse?.notes || "",
      isActive: warehouse?.isActive ?? true,
    },
    validationSchema: warehouseSchema,
    onSubmit: async (values) => {
      setServerError("");
      const payload = {
        storeId: values.storeId,
        name: values.name,
        code: values.code,
        location: values.location || undefined,
        street: values.street || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        postalCode: values.postalCode || undefined,
        country: values.country || undefined,
        contactPerson: values.contactPerson || undefined,
        phone: values.phone || undefined,
        notes: values.notes || undefined,
      };

      try {
        if (isEditing) {
          const { updateWarehouse } = await import(
            "@/services/warehouses.service"
          );
          await updateWarehouse(warehouse.id, payload);
          router.push(`/admin/warehouses/${warehouse.id}`);
        } else {
          const { createWarehouse } = await import(
            "@/services/warehouses.service"
          );
          const created = await createWarehouse(payload);
          router.push(`/admin/warehouses/${created.id}`);
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
    <FormSection title={isEditing ? t("editWarehouse") : t("newWarehouse")}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <Select
          label={t("store")}
          name="storeId"
          items={stores.map((s) => ({ value: s.id, label: s.name }))}
          value={formik.values.storeId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("storeId")}
          required
          placeholder={t("selectStore")}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={t("warehouseName")}
            name="name"
            type="text"
            placeholder={t("warehouseNamePlaceholder")}
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
            required
          />
          <InputGroup
            label={t("warehouseCode")}
            name="code"
            type="text"
            placeholder={t("warehouseCodePlaceholder")}
            value={formik.values.code}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("code")}
            required
          />
        </div>

        <InputGroup
          label={t("location")}
          name="location"
          type="text"
          placeholder={t("locationPlaceholder")}
          value={formik.values.location}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={t("contactPerson")}
            name="contactPerson"
            type="text"
            placeholder={t("contactPersonPlaceholder")}
            value={formik.values.contactPerson}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
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

        <Switch
          label={t("warehouseIsActive")}
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
                ? t("updateWarehouse")
                : t("createWarehouse")}
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
