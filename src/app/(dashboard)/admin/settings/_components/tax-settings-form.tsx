"use client";

import { useState } from "react";
import { FormSection } from "@/components/FormSection";
import type { TaxRate } from "@/types";

type Props = {
  taxRates: TaxRate[];
};

export function TaxSettingsForm({ taxRates: initialRates }: Props) {
  const [taxRates, setTaxRates] = useState<TaxRate[]>(initialRates);
  const [newLabel, setNewLabel] = useState("");
  const [newRate, setNewRate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleAdd() {
    if (!newLabel.trim() || !newRate.trim()) return;
    setSaving(true);
    const { createTaxRate } = await import("@/services/tax-rates.service");
    const created = await createTaxRate({
      label: newLabel.trim(),
      rate: parseFloat(newRate),
      isDefault: taxRates.length === 0,
    });
    setTaxRates((prev) => [...prev, created]);
    setNewLabel("");
    setNewRate("");
    setSaving(false);
    setSaved(true);
  }

  async function handleRemove(id: string) {
    const { deleteTaxRate } = await import("@/services/tax-rates.service");
    await deleteTaxRate(id);
    setTaxRates((prev) => prev.filter((t) => t.id !== id));
    setSaved(false);
  }

  async function handleSetDefault(id: string) {
    const { updateTaxRate } = await import("@/services/tax-rates.service");
    // Set all to non-default, then set the selected one to default
    const updated = await Promise.all(
      taxRates.map((t) =>
        updateTaxRate(t.id, {
          label: t.label,
          rate: t.rate,
          isDefault: t.id === id,
        }),
      ),
    );
    setTaxRates(updated);
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
            disabled={saving}
            className="rounded-lg border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-white disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {saved && (
          <span className="text-body-sm text-[#027A48]">
            Tax rates updated successfully
          </span>
        )}
      </div>
    </FormSection>
  );
}
