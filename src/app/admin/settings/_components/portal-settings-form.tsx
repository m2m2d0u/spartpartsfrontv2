"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { Switch } from "@/components/FormElements/switch";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings } from "@/types";

type Props = {
  settings: CompanySettings;
};

export function PortalSettingsForm({ settings }: Props) {
  const p = settings.clientPortal;
  const [form, setForm] = useState({
    portalEnabled: p.portalEnabled,
    minimumOrderAmount: p.minimumOrderAmount != null ? String(p.minimumOrderAmount) : "",
    shippingOption: p.shippingOption,
    shippingFlatRate: p.shippingFlatRate != null ? String(p.shippingFlatRate) : "",
    shippingFreeThreshold:
      p.shippingFreeThreshold != null ? String(p.shippingFreeThreshold) : "",
    termsAndConditions: p.termsAndConditions,
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
      clientPortal: {
        portalEnabled: form.portalEnabled,
        minimumOrderAmount: form.minimumOrderAmount
          ? parseInt(form.minimumOrderAmount)
          : null,
        shippingOption: form.shippingOption as
          | "flat_rate"
          | "free_above_threshold"
          | "custom",
        shippingFlatRate: form.shippingFlatRate
          ? parseInt(form.shippingFlatRate)
          : undefined,
        shippingFreeThreshold: form.shippingFreeThreshold
          ? parseInt(form.shippingFreeThreshold)
          : undefined,
        termsAndConditions: form.termsAndConditions,
      },
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Minimum Order Amount"
            name="minimumOrderAmount"
            type="number"
            placeholder="Leave empty for no minimum"
            value={form.minimumOrderAmount}
            handleChange={(e) => {
              setForm((prev) => ({
                ...prev,
                minimumOrderAmount: e.target.value,
              }));
              setSaved(false);
            }}
          />
          <Select
            label="Shipping Option"
            items={[
              { value: "flat_rate", label: "Flat Rate" },
              {
                value: "free_above_threshold",
                label: "Free Above Threshold",
              },
              { value: "custom", label: "Custom" },
            ]}
            value={form.shippingOption}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                shippingOption: e.target.value as "flat_rate" | "free_above_threshold" | "custom",
              }));
              setSaved(false);
            }}
          />
        </div>

        {form.shippingOption === "flat_rate" && (
          <InputGroup
            label="Flat Rate Amount"
            name="shippingFlatRate"
            type="number"
            placeholder="2500"
            value={form.shippingFlatRate}
            handleChange={(e) => {
              setForm((prev) => ({
                ...prev,
                shippingFlatRate: e.target.value,
              }));
              setSaved(false);
            }}
          />
        )}

        {form.shippingOption === "free_above_threshold" && (
          <InputGroup
            label="Free Shipping Threshold"
            name="shippingFreeThreshold"
            type="number"
            placeholder="50000"
            value={form.shippingFreeThreshold}
            handleChange={(e) => {
              setForm((prev) => ({
                ...prev,
                shippingFreeThreshold: e.target.value,
              }));
              setSaved(false);
            }}
          />
        )}

        <div>
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            Terms & Conditions
          </label>
          <textarea
            value={form.termsAndConditions}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                termsAndConditions: e.target.value,
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
