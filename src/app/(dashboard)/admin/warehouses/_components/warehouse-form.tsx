"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const [form, setForm] = useState({
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
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim() || !form.storeId) {
      setError("Store, name, and code are required.");
      return;
    }

    setSaving(true);

    const payload = {
      storeId: form.storeId,
      name: form.name,
      code: form.code,
      location: form.location || undefined,
      street: form.street || undefined,
      city: form.city || undefined,
      state: form.state || undefined,
      postalCode: form.postalCode || undefined,
      country: form.country || undefined,
      contactPerson: form.contactPerson || undefined,
      phone: form.phone || undefined,
      notes: form.notes || undefined,
    };

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
  }

  return (
    <FormSection title={isEditing ? "Edit Warehouse" : "New Warehouse"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {error}
          </div>
        )}

        <Select
          label="Store"
          items={stores.map((s) => ({ value: s.id, label: s.name }))}
          value={form.storeId}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, storeId: e.target.value }));
            setError("");
          }}
          required
          placeholder="Select a store"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Warehouse Name"
            name="name"
            type="text"
            placeholder="e.g. Entrepôt Principal"
            value={form.name}
            handleChange={handleChange}
            required
          />
          <InputGroup
            label="Warehouse Code"
            name="code"
            type="text"
            placeholder="e.g. WH-DK-01"
            value={form.code}
            handleChange={handleChange}
            required
          />
        </div>

        <InputGroup
          label="Location"
          name="location"
          type="text"
          placeholder="e.g. Zone Industrielle, Bâtiment A"
          value={form.location}
          handleChange={handleChange}
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
              value={form.street}
              handleChange={handleChange}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InputGroup
                label="City"
                name="city"
                type="text"
                placeholder="City"
                value={form.city}
                handleChange={handleChange}
              />
              <InputGroup
                label="State / Region"
                name="state"
                type="text"
                placeholder="State"
                value={form.state}
                handleChange={handleChange}
              />
              <InputGroup
                label="Postal Code"
                name="postalCode"
                type="text"
                placeholder="Postal code"
                value={form.postalCode}
                handleChange={handleChange}
              />
              <InputGroup
                label="Country"
                name="country"
                type="text"
                placeholder="Country"
                value={form.country}
                handleChange={handleChange}
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
            value={form.contactPerson}
            handleChange={handleChange}
          />
          <InputGroup
            label="Phone"
            name="phone"
            type="text"
            placeholder="+221 XX XXX XX XX"
            value={form.phone}
            handleChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Notes
          </label>
          <textarea
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
            rows={3}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            placeholder="Internal notes about this warehouse..."
          />
        </div>

        <Switch
          label="Warehouse is Active"
          checked={form.isActive}
          onChange={(checked) =>
            setForm((prev) => ({ ...prev, isActive: checked }))
          }
        />

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving
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
