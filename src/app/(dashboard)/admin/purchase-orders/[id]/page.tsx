import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { StatusBadge } from "@/components/ui/status-badge";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission, PurchaseOrderStatusCode } from "@/types";
import { getPurchaseOrderStatusVariant } from "@/lib/status-variants";
import { formatCurrency, type CurrencyFormatOptions } from "@/lib/format-number";
import { getPurchaseOrderById } from "@/services/purchase-orders.server";
import { getCompanySettings } from "@/services/company-settings.server";

export const metadata: Metadata = {
  title: "Purchase Order Detail",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PurchaseOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const [po, settings] = await Promise.all([
    getPurchaseOrderById(id).catch(() => null),
    getCompanySettings(),
  ]);

  if (!po) notFound();

  const currencyOpts: CurrencyFormatOptions = {
    symbol: settings.currencySymbol,
    position: settings.currencyPosition,
    decimals: settings.currencyDecimals,
    thousandsSeparator: settings.thousandsSeparator,
  };

  const t = await getTranslations("purchaseOrders");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={po.poNumber}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("procurement") },
          { label: tNav("purchaseOrders"), href: "/admin/purchase-orders" },
          { label: po.poNumber },
        ]}
        actions={
          po.status === PurchaseOrderStatusCode.DRAFT ? (
            <PermissionGate permission={Permission.PROCUREMENT_UPDATE}>
              <Link
                href={`/admin/purchase-orders/${po.id}/edit`}
                className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
              >
                {tCommon("edit")}
              </Link>
            </PermissionGate>
          ) : undefined
        }
      />

      <div className="space-y-6">
        {/* Order Info */}
        <FormSection title={t("orderDetails")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-body-sm text-dark-6">{t("poNumber")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {po.poNumber}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{tCommon("status")}</p>
              <div className="mt-1">
                <StatusBadge
                  variant={getPurchaseOrderStatusVariant(po.status)}
                >
                  {t(`status_${po.status}`)}
                </StatusBadge>
              </div>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("supplier")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {po.supplierName}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("totalAmount")}</p>
              <p className="mt-1 text-lg font-semibold text-dark dark:text-white">
                {formatCurrency(po.totalAmount, currencyOpts)}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("orderDate")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {new Date(po.orderDate).toLocaleDateString()}
              </p>
            </div>
            {po.expectedDeliveryDate && (
              <div>
                <p className="text-body-sm text-dark-6">
                  {t("expectedDelivery")}
                </p>
                <p className="mt-1 font-medium text-dark dark:text-white">
                  {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {po.destinationWarehouseName && (
              <div>
                <p className="text-body-sm text-dark-6">
                  {t("destinationWarehouse")}
                </p>
                <p className="mt-1 font-medium text-dark dark:text-white">
                  {po.destinationWarehouseName}
                </p>
              </div>
            )}
          </div>
        </FormSection>

        {/* Items Table */}
        <FormSection title={t("items")}>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-stroke dark:border-dark-3">
                  <th className="px-4 py-3 text-left text-body-sm font-medium text-dark-6">
                    {t("part")}
                  </th>
                  <th className="px-4 py-3 text-left text-body-sm font-medium text-dark-6">
                    {t("partNumber")}
                  </th>
                  <th className="px-4 py-3 text-right text-body-sm font-medium text-dark-6">
                    {t("quantity")}
                  </th>
                  <th className="px-4 py-3 text-right text-body-sm font-medium text-dark-6">
                    {t("receivedQty")}
                  </th>
                  <th className="px-4 py-3 text-right text-body-sm font-medium text-dark-6">
                    {t("unitPrice")}
                  </th>
                  <th className="px-4 py-3 text-right text-body-sm font-medium text-dark-6">
                    {t("lineTotal")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {po.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-stroke last:border-0 dark:border-dark-3"
                  >
                    <td className="px-4 py-3 font-medium text-dark dark:text-white">
                      {item.partName}
                    </td>
                    <td className="px-4 py-3 text-body-sm text-dark-6">
                      {item.partNumber}
                    </td>
                    <td className="px-4 py-3 text-right text-dark dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-dark dark:text-white">
                      {item.receivedQuantity}
                    </td>
                    <td className="px-4 py-3 text-right text-dark dark:text-white">
                      {formatCurrency(item.unitPrice, currencyOpts)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-dark dark:text-white">
                      {formatCurrency(
                        item.quantity * item.unitPrice,
                        currencyOpts,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-stroke dark:border-dark-3">
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-right font-medium text-dark dark:text-white"
                  >
                    {t("totalAmount")}
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-semibold text-dark dark:text-white">
                    {formatCurrency(po.totalAmount, currencyOpts)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </FormSection>

        {/* Notes */}
        {po.notes && (
          <FormSection title={t("notes")}>
            <p className="whitespace-pre-wrap text-dark dark:text-white">
              {po.notes}
            </p>
          </FormSection>
        )}
      </div>
    </>
  );
}
