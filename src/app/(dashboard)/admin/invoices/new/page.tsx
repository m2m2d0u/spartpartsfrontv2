import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getCustomers } from "@/services/customers.server";
import { getInvoiceTemplates } from "@/services/invoice-templates.server";
import { getCompanySettings } from "@/services/company-settings.server";
import { InvoiceForm } from "../_components/invoice-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("invoices");
  return { title: t("newInvoice") };
}

export default async function NewInvoicePage() {
  const [customersPage, templatesPage, settings] = await Promise.all([
    getCustomers(0, 500),
    getInvoiceTemplates(0, 100),
    getCompanySettings(),
  ]);

  const t = await getTranslations("invoices");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newInvoice")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("sales") },
          { label: tNav("invoices"), href: "/admin/invoices" },
          { label: t("newInvoice") },
        ]}
      />

      <InvoiceForm
        customers={customersPage.content}
        templates={templatesPage.content}
        currencyOptions={{
          symbol: settings.currencySymbol,
          position: settings.currencyPosition,
          decimals: settings.currencyDecimals,
          thousandsSeparator: settings.thousandsSeparator,
        }}
      />
    </>
  );
}
