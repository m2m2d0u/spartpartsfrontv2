import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  return (
    <>
      <PageHeader
        title={`Edit — ${part.name}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Parts", href: "/admin/parts" },
          { label: part.name, href: `/admin/parts/${part.id}` },
          { label: "Edit" },
        ]}
      />

      <PartForm part={part} categories={categoriesPage.content} />
    </>
  );
}
