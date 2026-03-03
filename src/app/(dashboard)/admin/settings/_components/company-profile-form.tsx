"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import InputGroup from "@/components/FormElements/InputGroup";
import { FormSection } from "@/components/FormSection";
import type { CompanySettings } from "@/types";

type Props = {
  settings: CompanySettings;
};

export function CompanyProfileForm({ settings }: Props) {
  const t = useTranslations("settings.companyProfile");
  const tCommon = useTranslations("common");

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
      title={t("title")}
      description={t("description")}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputGroup
          label={t("businessName")}
          name="companyName"
          type="text"
          placeholder={t("businessNamePlaceholder")}
          value={form.companyName}
          handleChange={handleChange}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label={tCommon("phone")}
            name="phone"
            type="text"
            placeholder={tCommon("phonePlaceholder")}
            value={form.phone}
            handleChange={handleChange}
          />
          <InputGroup
            label={tCommon("email")}
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={form.email}
            handleChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <InputGroup
            label={t("taxId")}
            name="taxId"
            type="text"
            placeholder={t("taxIdPlaceholder")}
            value={form.taxId}
            handleChange={handleChange}
          />
          <InputGroup
            label={t("ninea")}
            name="ninea"
            type="text"
            placeholder={t("nineaPlaceholder")}
            value={form.ninea}
            handleChange={handleChange}
          />
          <InputGroup
            label={t("rccm")}
            name="rccm"
            type="text"
            placeholder={t("rccmPlaceholder")}
            value={form.rccm}
            handleChange={handleChange}
          />
        </div>

        <div className="border-t border-stroke pt-5 dark:border-dark-3">
          <h4 className="mb-4 text-body-sm font-medium text-dark dark:text-white">
            {tCommon("address")}
          </h4>
          <div className="space-y-5">
            <InputGroup
              label={tCommon("street")}
              name="street"
              type="text"
              placeholder={tCommon("streetPlaceholder")}
              value={form.street}
              handleChange={handleChange}
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InputGroup
                label={tCommon("city")}
                name="city"
                type="text"
                placeholder={tCommon("cityPlaceholder")}
                value={form.city}
                handleChange={handleChange}
              />
              <InputGroup
                label={tCommon("stateRegion")}
                name="state"
                type="text"
                placeholder={tCommon("statePlaceholder")}
                value={form.state}
                handleChange={handleChange}
              />
              <InputGroup
                label={tCommon("postalCode")}
                name="postalCode"
                type="text"
                placeholder={tCommon("postalCodePlaceholder")}
                value={form.postalCode}
                handleChange={handleChange}
              />
              <InputGroup
                label={tCommon("country")}
                name="country"
                type="text"
                placeholder={tCommon("countryPlaceholder")}
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
            {saving ? tCommon("saving") : t("saveChanges")}
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
