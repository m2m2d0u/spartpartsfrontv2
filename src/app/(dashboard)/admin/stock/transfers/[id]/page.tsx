import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { FormSection } from "@/components/FormSection";
import { StatusBadge } from "@/components/ui/status-badge";
import { getStockTransferStatusVariant } from "@/lib/status-variants";
import { getStockTransferById } from "@/services/stock-transfers.server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransferActions } from "./_components/transfer-actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("stockTransfers");
  return { title: t("title") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StockTransferDetailPage({ params }: Props) {
  const { id } = await params;
  const transfer = await getStockTransferById(id).catch(() => null);

  if (!transfer) notFound();

  const t = await getTranslations("stockTransfers");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${t("transferNumber")}: ${transfer.transferNumber}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stock") },
          { label: tNav("stockTransfers"), href: "/admin/stock/transfers" },
          { label: transfer.transferNumber },
        ]}
        actions={
          <div className="flex items-center gap-3">
            {transfer.status === "PENDING" && (
              <Link
                href={`/admin/stock/transfers/${transfer.id}/edit`}
                className="inline-flex items-center rounded-lg border border-stroke px-5 py-2.5 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2"
              >
                {tCommon("edit")}
              </Link>
            )}
            <TransferActions
              transferId={transfer.id}
              status={transfer.status}
            />
          </div>
        }
      />

      <div className="space-y-6">
        <FormSection title={t("transferDetails")}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-body-sm text-dark-6">{t("transferNumber")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {transfer.transferNumber}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">
                {t("sourceWarehouse")}
              </p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {transfer.sourceWarehouseName}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">
                {t("destinationWarehouse")}
              </p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {transfer.destinationWarehouseName}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{t("transferDate")}</p>
              <p className="mt-1 font-medium text-dark dark:text-white">
                {new Date(transfer.transferDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-body-sm text-dark-6">{tCommon("status")}</p>
              <div className="mt-1">
                <StatusBadge
                  variant={getStockTransferStatusVariant(transfer.status)}
                >
                  {t(`status_${transfer.status}`)}
                </StatusBadge>
              </div>
            </div>
            {transfer.notes && (
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-body-sm text-dark-6">{t("notes")}</p>
                <p className="mt-1 text-dark dark:text-white">
                  {transfer.notes}
                </p>
              </div>
            )}
          </div>
        </FormSection>

        <FormSection title={t("transferItems")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("partNumber")}</TableHead>
                <TableHead>{t("partName")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfer.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-dark dark:text-white">
                    {item.partNumber}
                  </TableCell>
                  <TableCell>{item.partName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FormSection>
      </div>
    </>
  );
}
