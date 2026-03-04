import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { PermissionGate } from "@/components/PermissionGate";
import { Permission } from "@/types";
import { getInvoiceTemplates } from "@/services/invoice-templates.server";
import { InvoiceTemplatesTable } from "./_components/invoice-templates-table";

export const metadata: Metadata = {
  title: "Invoice Templates",
};

async function TemplatesData() {
  const page = await getInvoiceTemplates();
  return <InvoiceTemplatesTable templates={page.content} />;
}

export default async function InvoiceTemplatesPage() {
  const t = await getTranslations("invoiceTemplates");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("sales") },
          { label: tNav("invoiceTemplates") },
        ]}
        actions={
          <PermissionGate permission={Permission.INVOICE_CREATE}>
            <Link
              href="/admin/invoice-templates/new"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
            >
              {t("addTemplate")}
            </Link>
          </PermissionGate>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={5} />}>
        <TemplatesData />
      </Suspense>
    </>
  );
}
