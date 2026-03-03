import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getCompanySettings } from "@/services/company-settings.server";
import { getTaxRates } from "@/services/tax-rates.server";
import { CompanyProfileForm } from "./_components/company-profile-form";
import { TaxSettingsForm } from "./_components/tax-settings-form";
import { InvoiceDefaultsForm } from "./_components/invoice-defaults-form";
import { CurrencySettingsForm } from "./_components/currency-settings-form";
import { PortalSettingsForm } from "./_components/portal-settings-form";

export const metadata: Metadata = {
  title: "Company Settings",
};

export default async function SettingsPage() {
  const [settings, taxRatesPage] = await Promise.all([
    getCompanySettings(),
    getTaxRates(),
  ]);

  return (
    <>
      <PageHeader
        title="Company Settings"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings" },
        ]}
      />

      <div className="space-y-6">
        <CompanyProfileForm settings={settings} />
        <TaxSettingsForm taxRates={taxRatesPage.content} />
        <InvoiceDefaultsForm settings={settings} />
        <CurrencySettingsForm settings={settings} />
        <PortalSettingsForm settings={settings} />
      </div>
    </>
  );
}
