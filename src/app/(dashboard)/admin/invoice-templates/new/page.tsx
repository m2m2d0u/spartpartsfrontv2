import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getAllTaxRates } from "@/services/tax-rates.server";
import { InvoiceTemplateForm } from "../_components/invoice-template-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("invoiceTemplates");
  return { title: t("newTemplate") };
}

export default async function NewInvoiceTemplatePage() {
  const [t, tNav, taxRates] = await Promise.all([
    getTranslations("invoiceTemplates"),
    getTranslations("nav"),
    getAllTaxRates().catch(() => []),
  ]);

  return (
    <>
      <PageHeader
        title={t("newTemplate")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("sales") },
          { label: tNav("invoiceTemplates"), href: "/admin/invoice-templates" },
          { label: t("newTemplate") },
        ]}
      />

      <InvoiceTemplateForm taxRates={taxRates} />
    </>
  );
}
