import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { StatusBadge } from "@/components/ui/status-badge";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission, InvoiceStatusCode } from "@/types";
import { getInvoiceStatusVariant } from "@/lib/status-variants";
import { formatCurrency } from "@/lib/format-number";
import { getInvoiceById } from "@/services/invoices.server";
import { getCompanySettings } from "@/services/company-settings.server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceStatusActions } from "../_components/invoice-status-actions";
import { InvoicePdfActions } from "../_components/invoice-pdf-actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("invoices");
  return { title: t("title") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;
  const [invoice, companySettings] = await Promise.all([
    getInvoiceById(id).catch(() => null),
    getCompanySettings(),
  ]);

  if (!invoice) notFound();

  const t = await getTranslations("invoices");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const currencyOpts = {
    symbol: companySettings.currencySymbol,
    position: companySettings.currencyPosition,
    decimals: companySettings.currencyDecimals,
    thousandsSeparator: companySettings.thousandsSeparator,
  };

  return (
    <>
      <PageHeader
        title={`${t("invoiceNumber")}: ${invoice.invoiceNumber}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("sales") },
          { label: tNav("invoices"), href: "/admin/invoices" },
          { label: invoice.invoiceNumber },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <InvoicePdfActions
              invoiceId={invoice.id}
              invoiceNumber={invoice.invoiceNumber}
            />
            {invoice.status === InvoiceStatusCode.DRAFT && (
              <PermissionGate permission={Permission.INVOICE_UPDATE}>
                <Link
                  href={`/admin/invoices/${invoice.id}/edit`}
                  className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
                >
                  {tCommon("edit")}
                </Link>
              </PermissionGate>
            )}
          </div>
        }
      />

      <div className="space-y-6">
        {/* Invoice Info */}
        <FormSection title={t("invoiceDetails")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-body-sm text-dark-6">{t("invoiceNumber")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {invoice.invoiceNumber}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("invoiceType")}</p>
              <div className="mt-1">
                <StatusBadge variant="neutral">
                  {t(`type_${invoice.invoiceType}`)}
                </StatusBadge>
              </div>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{tCommon("status")}</p>
              <div className="mt-1">
                <StatusBadge
                  variant={getInvoiceStatusVariant(invoice.status)}
                >
                  {t(`status_${invoice.status}`)}
                </StatusBadge>
              </div>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("customer")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                <Link
                  href={`/admin/customers/${invoice.customerId}`}
                  className="text-primary hover:underline"
                >
                  {invoice.customerName}
                </Link>
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("issuedDate")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {new Date(invoice.issuedDate).toLocaleDateString()}
              </p>
            </div>
            {invoice.dueDate && (
              <div>
                <p className="text-body-sm text-dark-6">{t("dueDate")}</p>
                <p className="mt-1 font-medium text-dark dark:text-white">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {invoice.validityDate && (
              <div>
                <p className="text-body-sm text-dark-6">{t("validityDate")}</p>
                <p className="mt-1 font-medium text-dark dark:text-white">
                  {new Date(invoice.validityDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {invoice.paidDate && (
              <div>
                <p className="text-body-sm text-dark-6">{t("paidDate")}</p>
                <p className="mt-1 font-medium text-dark dark:text-white">
                  {new Date(invoice.paidDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {invoice.sourceWarehouseName && (
              <div>
                <p className="text-body-sm text-dark-6">
                  {t("sourceWarehouse")}
                </p>
                <p className="mt-1 font-medium text-dark dark:text-white">
                  {invoice.sourceWarehouseName}
                </p>
              </div>
            )}
          </div>
        </FormSection>

        {/* Issuer Info */}
        {invoice.issuerName && (
          <FormSection title={t("issuerInfo")}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-body-sm text-dark-6">{t("issuerName")}</p>
                <p className="mt-1 font-medium text-dark dark:text-white">
                  {invoice.issuerName}
                </p>
              </div>
              {invoice.issuerNinea && (
                <div>
                  <p className="text-body-sm text-dark-6">{t("issuerNinea")}</p>
                  <p className="mt-1 text-dark dark:text-white">
                    {invoice.issuerNinea}
                  </p>
                </div>
              )}
              {invoice.issuerRccm && (
                <div>
                  <p className="text-body-sm text-dark-6">{t("issuerRccm")}</p>
                  <p className="mt-1 text-dark dark:text-white">
                    {invoice.issuerRccm}
                  </p>
                </div>
              )}
              {invoice.issuerTaxId && (
                <div>
                  <p className="text-body-sm text-dark-6">{t("issuerTaxId")}</p>
                  <p className="mt-1 text-dark dark:text-white">
                    {invoice.issuerTaxId}
                  </p>
                </div>
              )}
              {invoice.issuerAddress && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-body-sm text-dark-6">
                    {t("issuerAddress")}
                  </p>
                  <p className="mt-1 text-dark dark:text-white">
                    {invoice.issuerAddress}
                  </p>
                </div>
              )}
            </div>
          </FormSection>
        )}

        {/* Items Table */}
        <FormSection title={t("items")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("partNumber")}</TableHead>
                <TableHead>{t("partName")}</TableHead>
                <TableHead className="text-right">{t("quantity")}</TableHead>
                <TableHead className="text-right">{t("unitPrice")}</TableHead>
                <TableHead className="text-right">
                  {t("discountPercent")}
                </TableHead>
                <TableHead className="text-right">
                  {t("discountAmount")}
                </TableHead>
                <TableHead className="text-right">{t("lineTotal")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-dark dark:text-white">
                    {item.partNumber}
                  </TableCell>
                  <TableCell>{item.partName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice, currencyOpts)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.discountPercent > 0
                      ? `${item.discountPercent}%`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.discountAmount > 0
                      ? formatCurrency(item.discountAmount, currencyOpts)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium text-dark dark:text-white">
                    {formatCurrency(item.totalPrice, currencyOpts)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-6">{t("subtotal")}</span>
                <span className="text-dark dark:text-white">
                  {formatCurrency(invoice.subtotal, currencyOpts)}
                </span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-dark-6">{t("discount")}</span>
                  <span className="text-red">
                    -{formatCurrency(invoice.discountAmount, currencyOpts)}
                  </span>
                </div>
              )}
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-dark-6">{t("tax")}</span>
                  <span className="text-dark dark:text-white">
                    {formatCurrency(invoice.taxAmount, currencyOpts)}
                  </span>
                </div>
              )}
              {invoice.depositDeduction > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-dark-6">{t("depositDeduction")}</span>
                  <span className="text-red">
                    -{formatCurrency(invoice.depositDeduction, currencyOpts)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-stroke pt-2 dark:border-dark-3">
                <span className="font-medium text-dark dark:text-white">
                  {t("totalAmount")}
                </span>
                <span className="font-semibold text-dark dark:text-white">
                  {formatCurrency(invoice.totalAmount, currencyOpts)}
                </span>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Payments */}
        {invoice.payments && invoice.payments.length > 0 && (
          <FormSection title={t("payments")}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("paymentDate")}</TableHead>
                  <TableHead>{t("paymentMethod")}</TableHead>
                  <TableHead className="text-right">
                    {t("paymentAmount")}
                  </TableHead>
                  <TableHead>{t("paymentReference")}</TableHead>
                  <TableHead>{t("notes")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell className="text-right font-medium text-dark dark:text-white">
                      {formatCurrency(payment.amount, currencyOpts)}
                    </TableCell>
                    <TableCell>{payment.reference || "—"}</TableCell>
                    <TableCell>{payment.notes || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </FormSection>
        )}

        {/* Notes */}
        {(invoice.notes || invoice.internalNotes) && (
          <FormSection title={t("notes")}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {invoice.notes && (
                <div>
                  <p className="text-body-sm text-dark-6">
                    {t("publicNotes")}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-dark dark:text-white">
                    {invoice.notes}
                  </p>
                </div>
              )}
              {invoice.internalNotes && (
                <div>
                  <p className="text-body-sm text-dark-6">
                    {t("internalNotes")}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-dark dark:text-white">
                    {invoice.internalNotes}
                  </p>
                </div>
              )}
            </div>
          </FormSection>
        )}

        {/* Status Actions */}
        <PermissionGate permission={Permission.INVOICE_UPDATE}>
          <InvoiceStatusActions
            invoiceId={invoice.id}
            currentStatus={invoice.status}
          />
        </PermissionGate>
      </div>
    </>
  );
}
