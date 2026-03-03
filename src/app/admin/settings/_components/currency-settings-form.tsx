"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings } from "@/types";

type Props = {
  settings: CompanySettings;
};

export function CurrencySettingsForm({ settings }: Props) {
  const [form, setForm] = useState({
    symbol: settings.currency.symbol,
    position: settings.currency.position,
    decimalPlaces: String(settings.currency.decimalPlaces),
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
      currency: {
        symbol: form.symbol,
        position: form.position as "before" | "after",
        decimalPlaces: parseInt(form.decimalPlaces) as 0 | 2 | 3,
      },
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <FormSection
      title="Currency Settings"
      description="How currency values are displayed across the system"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label="Currency Symbol"
            name="symbol"
            type="text"
            placeholder="FCFA"
            value={form.symbol}
            handleChange={(e) => {
              setForm((prev) => ({ ...prev, symbol: e.target.value }));
              setSaved(false);
            }}
          />
          <Select
            label="Symbol Position"
            items={[
              { value: "before", label: "Before amount ($100)" },
              { value: "after", label: "After amount (100 FCFA)" },
            ]}
            value={form.position}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, position: e.target.value as "before" | "after" }));
              setSaved(false);
            }}
          />
          <Select
            label="Decimal Places"
            items={[
              { value: "0", label: "0 (1,000)" },
              { value: "2", label: "2 (1,000.00)" },
              { value: "3", label: "3 (1,000.000)" },
            ]}
            value={form.decimalPlaces}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                decimalPlaces: e.target.value,
              }));
              setSaved(false);
            }}
          />
        </div>

        <div className="rounded-lg bg-gray-2 p-4 dark:bg-dark-2">
          <p className="text-body-sm text-dark-6">
            Preview:{" "}
            <span className="font-medium text-dark dark:text-white">
              {form.position === "before"
                ? `${form.symbol} 1${parseInt(form.decimalPlaces) > 0 ? "." + "0".repeat(parseInt(form.decimalPlaces)) : ",000"}`
                : `1${parseInt(form.decimalPlaces) > 0 ? "." + "0".repeat(parseInt(form.decimalPlaces)) : ",000"} ${form.symbol}`}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Currency Settings"}
          </button>
          {saved && (
            <span className="text-body-sm text-[#027A48]">
              Currency settings saved successfully
            </span>
          )}
        </div>
      </form>
    </FormSection>
  );
}
