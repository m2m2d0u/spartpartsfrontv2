"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings } from "@/types";

type Props = {
  settings: CompanySettings;
};

export function CurrencySettingsForm({ settings }: Props) {
  const t = useTranslations("settings.currency");
  const tCommon = useTranslations("common");

  const [form, setForm] = useState({
    currencySymbol: settings.currencySymbol,
    currencyPosition: settings.currencyPosition,
    currencyDecimals: String(settings.currencyDecimals),
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
      currencySymbol: form.currencySymbol,
      currencyPosition: form.currencyPosition,
      currencyDecimals: parseInt(form.currencyDecimals),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <FormSection
      title={t("title")}
      description={t("description")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label={t("currencySymbol")}
            name="currencySymbol"
            type="text"
            placeholder="FCFA"
            value={form.currencySymbol}
            handleChange={(e) => {
              setForm((prev) => ({ ...prev, currencySymbol: e.target.value }));
              setSaved(false);
            }}
          />
          <Select
            label={t("symbolPosition")}
            items={[
              { value: "BEFORE", label: t("beforeAmount") },
              { value: "AFTER", label: t("afterAmount") },
            ]}
            value={form.currencyPosition}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, currencyPosition: e.target.value }));
              setSaved(false);
            }}
          />
          <Select
            label={t("decimalPlaces")}
            items={[
              { value: "0", label: "0 (1,000)" },
              { value: "2", label: "2 (1,000.00)" },
              { value: "3", label: "3 (1,000.000)" },
            ]}
            value={form.currencyDecimals}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                currencyDecimals: e.target.value,
              }));
              setSaved(false);
            }}
          />
        </div>

        <div className="rounded-lg bg-gray-2 p-4 dark:bg-dark-2">
          <p className="text-body-sm text-dark-6">
            {t("preview")}:{" "}
            <span className="font-medium text-dark dark:text-white">
              {form.currencyPosition === "BEFORE"
                ? `${form.currencySymbol} 1${parseInt(form.currencyDecimals) > 0 ? "." + "0".repeat(parseInt(form.currencyDecimals)) : ",000"}`
                : `1${parseInt(form.currencyDecimals) > 0 ? "." + "0".repeat(parseInt(form.currencyDecimals)) : ",000"} ${form.currencySymbol}`}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? tCommon("saving") : t("saveCurrency")}
          </button>
          {saved && (
            <span className="text-body-sm text-[#027A48]">
              {t("savedSuccess")}
            </span>
          )}
        </div>
      </form>
    </FormSection>
  );
}
