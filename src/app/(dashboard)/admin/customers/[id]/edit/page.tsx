import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getCustomerById } from "@/services/customers.server";
import { CustomerForm } from "../../_components/customer-form";

export const metadata: Metadata = {
  title: "Edit Customer",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({ params }: Props) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) notFound();

  const t = await getTranslations("customers");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("editCustomer")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("customers"), href: "/admin/customers" },
          { label: customer.name, href: `/admin/customers/${customer.id}` },
          { label: t("editCustomer") },
        ]}
      />

      <CustomerForm customer={customer} />
    </>
  );
}
