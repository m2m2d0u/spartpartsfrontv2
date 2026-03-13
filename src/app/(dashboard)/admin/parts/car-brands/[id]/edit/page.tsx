import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getCarBrandById } from "@/services/car-brands.server";
import { CarBrandForm } from "../../_components/car-brand-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("carBrands");
  return { title: t("editCarBrand") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCarBrandPage({ params }: Props) {
  const { id } = await params;
  const carBrand = await getCarBrandById(id);

  if (!carBrand) notFound();

  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${carBrand.name}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("carBrands"), href: "/admin/parts/car-brands" },
          { label: carBrand.name },
          { label: tCommon("edit") },
        ]}
      />

      <CarBrandForm carBrand={carBrand} />
    </>
  );
}
