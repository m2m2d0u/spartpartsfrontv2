import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getInvoiceTemplateById } from "@/services/invoice-templates.server";
import { InvoiceTemplateForm } from "../../_components/invoice-template-form";

export const metadata: Metadata = {
  title: "Edit Invoice Template",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditInvoiceTemplatePage({ params }: Props) {
  const { id } = await params;
  const template = await getInvoiceTemplateById(id).catch(() => null);

  if (!template) notFound();

  const t = await getTranslations("invoiceTemplates");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${template.name}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("sales") },
          { label: tNav("invoiceTemplates"), href: "/admin/invoice-templates" },
          {
            label: template.name,
            href: `/admin/invoice-templates/${template.id}`,
          },
          { label: tCommon("edit") },
        ]}
      />

      <InvoiceTemplateForm template={template} />
    </>
  );
}
