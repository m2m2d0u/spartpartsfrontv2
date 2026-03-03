"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
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

const warehouseSchema = Yup.object({
  storeId: Yup.string().required("Store is required"),
  name: Yup.string().trim().required("Warehouse name is required"),
  code: Yup.string().trim().required("Warehouse code is required"),
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

export function WarehouseForm({ warehouse, stores, defaultStoreId }: Props) {
  const router = useRouter();
  const isEditing = !!warehouse;
  const [serverError, setServerError] = useState("");

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
        setServerError("Failed to save warehouse. Please try again.");
      }
    },
  });

  function fieldError(name: keyof typeof formik.values) {
    return formik.touched[name] ? (formik.errors[name] as string) : undefined;
  }

  return (
    <FormSection title={isEditing ? "Edit Warehouse" : "New Warehouse"}>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {serverError && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {serverError}
          </div>
        )}

        <Select
          label="Store"
          name="storeId"
          items={stores.map((s) => ({ value: s.id, label: s.name }))}
          value={formik.values.storeId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={fieldError("storeId")}
          required
          placeholder="Select a store"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Warehouse Name"
            name="name"
            type="text"
            placeholder="e.g. Entrepôt Principal"
            value={formik.values.name}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
            required
          />
          <InputGroup
            label="Warehouse Code"
            name="code"
            type="text"
            placeholder="e.g. WH-DK-01"
            value={formik.values.code}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("code")}
            required
          />
        </div>

        <InputGroup
          label="Location"
          name="location"
          type="text"
          placeholder="e.g. Zone Industrielle, Bâtiment A"
          value={formik.values.location}
          handleChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            Address
          </h4>
          <div className="space-y-5">
            <InputGroup
              label="Street"
              name="street"
              type="text"
              placeholder="Street address"
              value={formik.values.street}
              handleChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InputGroup
                label="City"
                name="city"
                type="text"
                placeholder="City"
                value={formik.values.city}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label="State / Region"
                name="state"
                type="text"
                placeholder="State"
                value={formik.values.state}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label="Postal Code"
                name="postalCode"
                type="text"
                placeholder="Postal code"
                value={formik.values.postalCode}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputGroup
                label="Country"
                name="country"
                type="text"
                placeholder="Country"
                value={formik.values.country}
                handleChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Contact Person"
            name="contactPerson"
            type="text"
            placeholder="Contact name"
            value={formik.values.contactPerson}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputGroup
            label="Phone"
            name="phone"
            type="text"
            placeholder="+221 XX XXX XX XX"
            value={formik.values.phone}
            handleChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Notes
          </label>
          <textarea
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={3}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            placeholder="Internal notes about this warehouse..."
          />
        </div>

        <Switch
          label="Warehouse is Active"
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
              ? "Saving..."
              : isEditing
                ? "Update Warehouse"
                : "Create Warehouse"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-stroke px-6 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </FormSection>
  );
}
