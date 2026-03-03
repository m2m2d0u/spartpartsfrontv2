"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings } from "@/types";

type Props = {
  settings: CompanySettings;
};

export function CompanyProfileForm({ settings }: Props) {
  const [form, setForm] = useState({
    companyName: settings.companyName,
    phone: settings.phone,
    email: settings.email,
    taxId: settings.taxId,
    ninea: settings.ninea,
    rccm: settings.rccm,
    street: settings.street,
    city: settings.city,
    state: settings.state,
    postalCode: settings.postalCode,
    country: settings.country,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { updateCompanySettings } = await import(
      "@/services/company-settings.service"
    );
    await updateCompanySettings(form);
    setSaving(false);
    setSaved(true);
  }

  return (
    <FormSection
      title="Company Profile"
      description="Basic business information shown on invoices and documents"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputGroup
          label="Business Name"
          name="companyName"
          type="text"
          placeholder="Company name"
          value={form.companyName}
          handleChange={handleChange}
        />

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
            placeholder="contact@company.sn"
            value={form.email}
            handleChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label="Tax ID"
            name="taxId"
            type="text"
            placeholder="Tax ID"
            value={form.taxId}
            handleChange={handleChange}
          />
          <InputGroup
            label="NINEA"
            name="ninea"
            type="text"
            placeholder="NINEA number"
            value={form.ninea}
            handleChange={handleChange}
          />
          <InputGroup
            label="RCCM"
            name="rccm"
            type="text"
            placeholder="RCCM number"
            value={form.rccm}
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

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saved && (
            <span className="text-body-sm text-[#027A48]">
              Changes saved successfully
            </span>
          )}
        </div>
      </form>
    </FormSection>
  );
}
