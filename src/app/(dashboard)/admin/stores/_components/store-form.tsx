"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const [form, setForm] = useState({
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
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setError("Name and code are required.");
      return;
    }

    setSaving(true);

    if (isEditing) {
      const { updateStore } = await import("@/services/stores.service");
      await updateStore(store.id, { ...form });
      router.push(`/admin/stores/${store.id}`);
    } else {
      const { createStore } = await import("@/services/stores.service");
      const created = await createStore(form);
      router.push(`/admin/stores/${created.id}`);
    }
    router.refresh();
  }

  return (
    <FormSection title={isEditing ? "Edit Store" : "New Store"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318] dark:bg-[#B42318]/10 dark:text-[#FDA29B]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Store Name"
            name="name"
            type="text"
            placeholder="e.g. SenParts Dakar"
            value={form.name}
            handleChange={handleChange}
            required
          />
          <InputGroup
            label="Store Code"
            name="code"
            type="text"
            placeholder="e.g. STR-DK"
            value={form.code}
            handleChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Phone"
            name="phone"
            type="text"
            placeholder="+221 XX XXX XX XX"
            value={form.phone}
            handleChange={handleChange}
          />
          <InputGroup
            label="Email"
            name="email"
            type="email"
            placeholder="store@company.sn"
            value={form.email}
            handleChange={handleChange}
          />
        </div>

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

        <Switch
          label="Store is Active"
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
                ? "Update Store"
                : "Create Store"}
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
