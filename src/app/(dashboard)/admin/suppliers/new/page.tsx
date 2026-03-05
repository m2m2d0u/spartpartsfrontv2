import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { SupplierForm } from "../_components/supplier-form";

export const metadata: Metadata = {
  title: "New Supplier",
};

export default async function NewSupplierPage() {
  const t = await getTranslations("suppliers");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newSupplier")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("procurement") },
          { label: tNav("suppliers"), href: "/admin/suppliers" },
          { label: t("newSupplier") },
        ]}
      />

      <SupplierForm />
    </>
  );
}
