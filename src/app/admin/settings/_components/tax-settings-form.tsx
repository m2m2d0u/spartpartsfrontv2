"use client";

import { useState } from "react";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings, TaxRate } from "@/types";

type Props = {
  settings: CompanySettings;
};

export function TaxSettingsForm({ settings }: Props) {
  const [taxRates, setTaxRates] = useState<TaxRate[]>(settings.taxRates);
  const [newLabel, setNewLabel] = useState("");
  const [newRate, setNewRate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleAdd() {
    if (!newLabel.trim() || !newRate.trim()) return;
    const rate: TaxRate = {
      id: `tax-${Date.now()}`,
      label: newLabel.trim(),
      rate: parseFloat(newRate),
      isDefault: taxRates.length === 0,
    };
    setTaxRates((prev) => [...prev, rate]);
    setNewLabel("");
    setNewRate("");
    setSaved(false);
  }

  function handleRemove(id: string) {
    setTaxRates((prev) => prev.filter((t) => t.id !== id));
    setSaved(false);
  }

  function handleSetDefault(id: string) {
    setTaxRates((prev) =>
      prev.map((t) => ({ ...t, isDefault: t.id === id })),
    );
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const { updateCompanySettings } = await import(
      "@/services/company-settings.service"
    );
    await updateCompanySettings({ taxRates });
    setSaving(false);
    setSaved(true);
  }

  return (
    <FormSection
      title="Tax Rates"
      description="Manage tax rates applied to invoices"
    >
      <div className="space-y-4">
        {/* Existing rates */}
        <div className="space-y-2">
          {taxRates.map((rate) => (
            <div
              key={rate.id}
              className="flex items-center gap-3 rounded-lg border border-stroke px-4 py-3 dark:border-dark-3"
            >
              <span className="flex-1 text-sm text-dark dark:text-white">
                {rate.label}
              </span>
              <span className="text-sm font-medium text-dark dark:text-white">
                {rate.rate}%
              </span>
              {rate.isDefault ? (
                <span className="rounded-full bg-[#ECFDF3] px-2.5 py-0.5 text-xs font-medium text-[#027A48] dark:bg-[#027A48]/10 dark:text-[#6CE9A6]">
                  Default
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetDefault(rate.id)}
                  className="text-xs text-primary hover:underline"
                >
                  Set default
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(rate.id)}
                className="text-xs text-red hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add new rate */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-body-sm font-medium text-dark dark:text-white">
              Label
            </label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. TVA 18%"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
          <div className="w-28">
            <label className="mb-1.5 block text-body-sm font-medium text-dark dark:text-white">
              Rate (%)
            </label>
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              placeholder="18"
              min="0"
              max="100"
              step="0.01"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-white"
          >
            Add
          </button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Tax Rates"}
          </button>
          {saved && (
            <span className="text-body-sm text-[#027A48]">
              Tax rates saved successfully
            </span>
          )}
        </div>
      </div>
    </FormSection>
  );
}
