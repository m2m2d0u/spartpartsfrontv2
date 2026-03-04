import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getCustomers } from "@/services/customers.server";
import { getInvoiceTemplates } from "@/services/invoice-templates.server";
import { InvoiceForm } from "../_components/invoice-form";

export const metadata: Metadata = {
  title: "New Invoice",
};

export default async function NewInvoicePage() {
  const [customersPage, templatesPage] = await Promise.all([
    getCustomers(0, 500),
    getInvoiceTemplates(0, 100),
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
      />
    </>
  );
}
