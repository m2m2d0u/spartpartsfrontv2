import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getCarBrands } from "@/services/car-brands.server";
import { CarModelForm } from "../_components/car-model-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("carModels");
  return { title: t("newCarModel") };
}

export default async function NewCarModelPage() {
  const t = await getTranslations("carModels");
  const tNav = await getTranslations("nav");
  const brandsPaged = await getCarBrands();

  return (
    <>
      <PageHeader
        title={t("newCarModel")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("carModels"), href: "/admin/parts/car-models" },
          { label: t("newCarModel") },
        ]}
      />

      <CarModelForm brands={brandsPaged.content} />
    </>
  );
}
