import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { CarBrandForm } from "../_components/car-brand-form";

export const metadata: Metadata = {
  title: "New Car Brand",
};

export default async function NewCarBrandPage() {
  const t = await getTranslations("carBrands");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newCarBrand")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("carBrands"), href: "/admin/parts/car-brands" },
          { label: t("newCarBrand") },
        ]}
      />

      <CarBrandForm />
    </>
  );
}
