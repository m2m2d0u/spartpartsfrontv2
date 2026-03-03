import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { TagForm } from "../_components/tag-form";

export const metadata: Metadata = {
  title: "New Tag",
};

export default async function NewTagPage() {
  const t = await getTranslations("tags");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newTag")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("tags"), href: "/admin/parts/tags" },
          { label: t("newTag") },
        ]}
      />

      <TagForm />
    </>
  );
}
