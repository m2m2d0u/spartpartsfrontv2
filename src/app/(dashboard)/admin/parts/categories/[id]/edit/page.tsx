import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getCategoryById } from "@/services/categories.server";
import { CategoryForm } from "../../_components/category-form";

export const metadata: Metadata = {
  title: "Edit Category",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — ${category.name}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Parts", href: "/admin/parts" },
          { label: "Categories", href: "/admin/parts/categories" },
          { label: category.name },
          { label: "Edit" },
        ]}
      />

      <CategoryForm category={category} />
    </>
  );
}
