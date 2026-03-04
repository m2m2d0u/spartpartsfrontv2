import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { InvoiceTemplateForm } from "../_components/invoice-template-form";

export const metadata: Metadata = {
  title: "New Invoice Template",
};

export default async function NewInvoiceTemplatePage() {
  const t = await getTranslations("invoiceTemplates");
  const tNav = await getTranslations("nav");

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

      <InvoiceTemplateForm />
    </>
  );
}
