import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getPartById } from "@/services/parts.server";
import { getCategories } from "@/services/categories.server";
import { PartForm } from "../../_components/part-form";

export const metadata: Metadata = {
  title: "Edit Part",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPartPage({ params }: Props) {
  const { id } = await params;
  const [part, categoriesPage] = await Promise.all([
    getPartById(id),
    getCategories(),
  ]);

  if (!part) notFound();

  const t = await getTranslations("parts");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${part.name}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: part.name, href: `/admin/parts/${part.id}` },
          { label: tCommon("edit") },
        ]}
      />

      <PartForm part={part} categories={categoriesPage.content} />
    </>
  );
}
