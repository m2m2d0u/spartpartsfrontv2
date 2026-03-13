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
import { TemplateImageThumbnail } from "../_components/template-image-thumbnail";
import { TemplatePreviewButton } from "../_components/template-preview-button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("invoiceTemplates");
  return { title: t("title") };
}

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
          <div className="flex items-center gap-3">
            <TemplatePreviewButton
              design={template.design}
              templateData={{
                name: template.name,
                description: template.description || undefined,
                isDefault: template.isDefault,
                primaryColor: template.primaryColor,
                accentColor: template.accentColor,
                fontFamily: template.fontFamily,
                design: template.design,
                headerLayout: template.headerLayout,
                logoUrl: template.logoUrl ?? undefined,
                headerImageUrl: template.headerImageUrl ?? undefined,
                footerImageUrl: template.footerImageUrl ?? undefined,
                stampImageUrl: template.stampImageUrl ?? undefined,
                signatureImageUrl: template.signatureImageUrl ?? undefined,
                watermarkImageUrl: template.watermarkImageUrl ?? undefined,
                showNinea: template.showNinea,
                showRccm: template.showRccm,
                showTaxId: template.showTaxId,
                showWarehouseAddress: template.showWarehouseAddress,
                showCustomerTaxId: template.showCustomerTaxId,
                showPaymentTerms: template.showPaymentTerms,
                showDiscountColumn: template.showDiscountColumn,
                taxRateId: template.taxRateId ?? undefined,
                defaultNotes: template.defaultNotes || undefined,
              }}
            />
            <PermissionGate permission={Permission.INVOICE_UPDATE}>
              <Link
                href={`/admin/invoice-templates/${template.id}/edit`}
                className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                {tCommon("edit")}
              </Link>
            </PermissionGate>
          </div>
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
            <div>
              <p className="text-body-sm text-dark-6">{t("taxRate")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {template.taxRateLabel ?? t("noTaxRate")}
              </p>
            </div>
          </div>
        </FormSection>

        {/* Images */}
        <FormSection title={t("images")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(
              [
                { label: t("logo"), urlField: template.logoUrl, endpoint: "logo" as const },
                { label: t("headerImage"), urlField: template.headerImageUrl, endpoint: "header-image" as const },
                { label: t("footerImage"), urlField: template.footerImageUrl, endpoint: "footer-image" as const },
                { label: t("stamp"), urlField: template.stampImageUrl, endpoint: "stamp" as const },
                { label: t("signature"), urlField: template.signatureImageUrl, endpoint: "signature" as const },
                { label: t("watermark"), urlField: template.watermarkImageUrl, endpoint: "watermark" as const },
              ] as const
            ).map((img) => (
              <TemplateImageThumbnail
                key={img.endpoint}
                templateId={template.id}
                label={img.label}
                hasImage={!!img.urlField}
                imageType={img.endpoint}
              />
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
