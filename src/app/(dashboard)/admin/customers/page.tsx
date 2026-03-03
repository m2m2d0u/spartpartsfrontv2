import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { DataTableSkeleton } from "@/components/DataTable/skeleton";
import { getCustomers } from "@/services/customers.server";
import { CustomersTable } from "./_components/customers-table";

export const metadata: Metadata = {
  title: "Customers",
};

async function CustomersData() {
  const customersPage = await getCustomers(0, 200);
  return <CustomersTable customers={customersPage.content} />;
}

export default async function CustomersPage() {
  const t = await getTranslations("customers");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("customers") },
        ]}
        actions={
          <Link
            href="/admin/customers/new"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-90"
          >
            {t("addCustomer")}
          </Link>
        }
      />

      <Suspense fallback={<DataTableSkeleton columns={6} />}>
        <CustomersData />
      </Suspense>
    </>
  );
}
