import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { CustomerForm } from "../_components/customer-form";

export const metadata: Metadata = {
  title: "New Customer",
};

export default async function NewCustomerPage() {
  const t = await getTranslations("customers");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newCustomer")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("customers"), href: "/admin/customers" },
          { label: t("newCustomer") },
        ]}
      />

      <CustomerForm />
    </>
  );
}
