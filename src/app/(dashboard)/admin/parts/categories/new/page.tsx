import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { CategoryForm } from "../_components/category-form";

export const metadata: Metadata = {
  title: "New Category",
};

export default async function NewCategoryPage() {
  const t = await getTranslations("categories");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newCategory")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("categories"), href: "/admin/parts/categories" },
          { label: t("newCategory") },
        ]}
      />

      <CategoryForm />
    </>
  );
}
