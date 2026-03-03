"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings } from "@/types";

type Props = {
  settings: CompanySettings;
};

export function PortalSettingsForm({ settings }: Props) {
  const [form, setForm] = useState({
    portalEnabled: settings.portalEnabled,
    portalMinOrderAmount: settings.portalMinOrderAmount != null ? String(settings.portalMinOrderAmount) : "",
    portalShippingFlatRate: settings.portalShippingFlatRate != null ? String(settings.portalShippingFlatRate) : "",
    portalFreeShippingAbove: settings.portalFreeShippingAbove != null ? String(settings.portalFreeShippingAbove) : "",
    portalTermsText: settings.portalTermsText,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { updateCompanySettings } = await import(
      "@/services/company-settings.service"
    );
    await updateCompanySettings({
      portalEnabled: form.portalEnabled,
      portalMinOrderAmount: form.portalMinOrderAmount
        ? parseFloat(form.portalMinOrderAmount)
        : null,
      portalShippingFlatRate: form.portalShippingFlatRate
        ? parseFloat(form.portalShippingFlatRate)
        : null,
      portalFreeShippingAbove: form.portalFreeShippingAbove
        ? parseFloat(form.portalFreeShippingAbove)
        : null,
      portalTermsText: form.portalTermsText,
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <FormSection
      title="Client Portal"
      description="Settings for the customer-facing portal"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Switch
          label="Portal Enabled"
          checked={form.portalEnabled}
          onChange={(checked) => {
            setForm((prev) => ({ ...prev, portalEnabled: checked }));
            setSaved(false);
          }}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label="Minimum Order Amount"
            name="portalMinOrderAmount"
            type="number"
            placeholder="Leave empty for no minimum"
            value={form.portalMinOrderAmount}
            handleChange={(e) => {
              setForm((prev) => ({
                ...prev,
                portalMinOrderAmount: e.target.value,
              }));
              setSaved(false);
            }}
          />
          <InputGroup
            label="Flat Shipping Rate"
            name="portalShippingFlatRate"
            type="number"
            placeholder="2500"
            value={form.portalShippingFlatRate}
            handleChange={(e) => {
              setForm((prev) => ({
                ...prev,
                portalShippingFlatRate: e.target.value,
              }));
              setSaved(false);
            }}
          />
          <InputGroup
            label="Free Shipping Above"
            name="portalFreeShippingAbove"
            type="number"
            placeholder="50000"
            value={form.portalFreeShippingAbove}
            handleChange={(e) => {
              setForm((prev) => ({
                ...prev,
                portalFreeShippingAbove: e.target.value,
              }));
              setSaved(false);
            }}
          />
        </div>

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Terms & Conditions
          </label>
          <textarea
            value={form.portalTermsText}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                portalTermsText: e.target.value,
              }));
              setSaved(false);
            }}
            rows={4}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            placeholder="Terms and conditions for the client portal..."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Portal Settings"}
          </button>
          {saved && (
            <span className="text-body-sm text-[#027A48]">
              Portal settings saved successfully
            </span>
          )}
        </div>
      </form>
    </FormSection>
  );
}
