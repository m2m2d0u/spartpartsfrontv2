import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getCarModelById } from "@/services/car-models.server";
import { getCarBrands } from "@/services/car-brands.server";
import { CarModelForm } from "../../_components/car-model-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("carModels");
  return { title: t("editCarModel") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCarModelPage({ params }: Props) {
  const { id } = await params;
  const [carModel, brandsPaged] = await Promise.all([
    getCarModelById(id),
    getCarBrands(),
  ]);

  if (!carModel) notFound();

  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${carModel.name}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("carModels"), href: "/admin/parts/car-models" },
          { label: carModel.name },
          { label: tCommon("edit") },
        ]}
      />

      <CarModelForm carModel={carModel} brands={brandsPaged.content} />
    </>
  );
}
