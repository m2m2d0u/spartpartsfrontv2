import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { CustomerForm } from "../_components/customer-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("customers");
  return { title: t("newCustomer") };
}

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
