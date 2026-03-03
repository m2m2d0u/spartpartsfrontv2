import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getCategories } from "@/services/categories.server";
import { getTags } from "@/services/tags.server";
import { PartForm } from "../_components/part-form";

export const metadata: Metadata = {
  title: "New Part",
};

export default async function NewPartPage() {
  const [categoriesPage, tagsPage] = await Promise.all([
    getCategories(),
    getTags(),
  ]);
  const t = await getTranslations("parts");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newPart")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: t("newPart") },
        ]}
      />

      <PartForm
        categories={categoriesPage.content}
        tags={tagsPage.content}
      />
    </>
  );
}
