import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getInvoiceById } from "@/services/invoices.server";
import { getCustomers } from "@/services/customers.server";
import { getInvoiceTemplates } from "@/services/invoice-templates.server";
import { getCompanySettings } from "@/services/company-settings.server";
import { InvoiceForm } from "../../_components/invoice-form";
import { InvoiceStatusCode, InvoiceTypeCode } from "@/types";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditInvoicePage({ params }: Props) {
  const { id } = await params;

  const [invoice, customersPage, templatesPage, settings] = await Promise.all([
    getInvoiceById(id).catch(() => null),
    getCustomers(0, 500),
    getInvoiceTemplates(0, 100),
    getCompanySettings(),
  ]);

  if (!invoice || invoice.status !== InvoiceStatusCode.DRAFT) notFound();

  const t = await getTranslations("invoices");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${invoice.invoiceNumber}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("sales") },
          { label: tNav("invoices"), href: "/admin/invoices" },
          {
            label: invoice.invoiceNumber,
            href: `/admin/invoices/${invoice.id}`,
          },
          { label: tCommon("edit") },
        ]}
      />

      <InvoiceForm
        invoice={invoice}
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
