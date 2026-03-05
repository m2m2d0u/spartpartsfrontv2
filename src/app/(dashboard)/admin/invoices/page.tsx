import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getInvoices } from "@/services/invoices.server";
import { getCompanySettings } from "@/services/company-settings.server";
import { InvoicesTable } from "./_components/invoices-table";

export const metadata: Metadata = {
  title: "Invoices",
};

async function InvoicesData() {
  const [page, settings] = await Promise.all([
    getInvoices(0, 20),
    getCompanySettings(),
  ]);
  return (
    <InvoicesTable
      invoices={page.content}
      totalElements={page.totalElements}
      initialPage={1}
      currencyOptions={{
        symbol: settings.currencySymbol,
        position: settings.currencyPosition,
        decimals: settings.currencyDecimals,
        thousandsSeparator: settings.thousandsSeparator,
      }}
    />
  );
}

export default async function InvoicesPage() {
  const t = await getTranslations("invoices");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("sales") },
          { label: tNav("invoices") },
        ]}
        actions={
          <PermissionGate permission={Permission.INVOICE_CREATE}>
            <Link
              href="/admin/invoices/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("createInvoice")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={7} />}>
        <InvoicesData />
      </Suspense>
    </>
  );
}
