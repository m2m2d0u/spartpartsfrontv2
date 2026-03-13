import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getSupplierById } from "@/services/suppliers.server";
import { SupplierForm } from "../../_components/supplier-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("suppliers");
  return { title: t("editSupplier") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSupplierPage({ params }: Props) {
  const { id } = await params;
  const supplier = await getSupplierById(id).catch(() => null);

  if (!supplier) notFound();

  const t = await getTranslations("suppliers");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("editSupplier")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("procurement") },
          { label: tNav("suppliers"), href: "/admin/suppliers" },
          { label: supplier.name, href: `/admin/suppliers/${supplier.id}` },
          { label: t("editSupplier") },
        ]}
      />

      <SupplierForm supplier={supplier} />
    </>
  );
}
