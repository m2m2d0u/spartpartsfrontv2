import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { StatusBadge } from "@/components/ui/status-badge";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getInvoiceTemplateById } from "@/services/invoice-templates.server";

export const metadata: Metadata = {
  title: "Invoice Template Details",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceTemplateDetailPage({ params }: Props) {
  const { id } = await params;
  const template = await getInvoiceTemplateById(id).catch(() => null);

  if (!template) notFound();

  const t = await getTranslations("invoiceTemplates");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={template.name}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("sales") },
          { label: tNav("invoiceTemplates"), href: "/admin/invoice-templates" },
          { label: template.name },
        ]}
        actions={
          <PermissionGate permission={Permission.INVOICE_UPDATE}>
            <Link
              href={`/admin/invoice-templates/${template.id}/edit`}
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {tCommon("edit")}
            </Link>
          </PermissionGate>
        }
      />

      <div className="space-y-6">
        {/* General Info */}
        <FormSection title={t("generalInfo")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-body-sm text-dark-6">{t("name")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {template.name}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("default")}</p>
              <div className="mt-1">
                {template.isDefault ? (
                  <StatusBadge variant="success">{tCommon("yes")}</StatusBadge>
                ) : (
                  <span className="text-dark dark:text-white">
                    {tCommon("no")}
                  </span>
                )}
              </div>
            </div>
            {template.description && (
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-body-sm text-dark-6">{t("description")}</p>
                <p className="mt-1 text-dark dark:text-white">
                  {template.description}
                </p>
              </div>
            )}
          </div>
        </FormSection>

        {/* Appearance */}
        <FormSection title={t("appearance")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-body-sm text-dark-6">{t("primaryColor")}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="inline-block size-6 rounded border border-stroke dark:border-dark-3"
                  style={{ backgroundColor: template.primaryColor }}
                />
                <span className="font-medium text-dark dark:text-white">
                  {template.primaryColor}
                </span>
              </div>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("accentColor")}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="inline-block size-6 rounded border border-stroke dark:border-dark-3"
                  style={{ backgroundColor: template.accentColor }}
                />
                <span className="font-medium text-dark dark:text-white">
                  {template.accentColor}
                </span>
              </div>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("font")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {template.fontFamily}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("design")}</p>
              <div className="mt-1">
                <StatusBadge variant="neutral">
                  {t(`design_${template.design}`)}
                </StatusBadge>
              </div>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("headerLayout")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {template.headerLayout}
              </p>
            </div>
          </div>
        </FormSection>

        {/* Images */}
        <FormSection title={t("images")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { label: t("logoUrl"), value: template.logoUrl },
              { label: t("headerImageUrl"), value: template.headerImageUrl },
              { label: t("footerImageUrl"), value: template.footerImageUrl },
              { label: t("stampImageUrl"), value: template.stampImageUrl },
              {
                label: t("signatureImageUrl"),
                value: template.signatureImageUrl,
              },
              {
                label: t("watermarkImageUrl"),
                value: template.watermarkImageUrl,
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-body-sm text-dark-6">{label}</p>
                {value ? (
                  <p className="mt-1 truncate text-dark dark:text-white">
                    {value}
                  </p>
                ) : (
                  <p className="mt-1 text-dark-6">—</p>
                )}
              </div>
            ))}
          </div>
        </FormSection>

        {/* Display Options */}
        <FormSection title={t("displayOptions")}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { label: t("showNinea"), value: template.showNinea },
              { label: t("showRccm"), value: template.showRccm },
              { label: t("showTaxId"), value: template.showTaxId },
              {
                label: t("showWarehouseAddress"),
                value: template.showWarehouseAddress,
              },
              {
                label: t("showCustomerTaxId"),
                value: template.showCustomerTaxId,
              },
              {
                label: t("showPaymentTerms"),
                value: template.showPaymentTerms,
              },
              {
                label: t("showDiscountColumn"),
                value: template.showDiscountColumn,
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`inline-block size-4 rounded-full ${value ? "bg-[#027A48]" : "bg-dark-6"}`}
                />
                <span className="text-dark dark:text-white">{label}</span>
              </div>
            ))}
          </div>
        </FormSection>

        {/* Default Notes */}
        {template.defaultNotes && (
          <FormSection title={t("defaultNotes")}>
            <p className="whitespace-pre-wrap text-dark dark:text-white">
              {template.defaultNotes}
            </p>
          </FormSection>
        )}
      </div>
    </>
  );
}
