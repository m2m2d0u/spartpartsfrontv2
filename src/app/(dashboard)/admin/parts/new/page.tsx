import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getCategories } from "@/services/categories.server";
import { PartForm } from "../_components/part-form";

export const metadata: Metadata = {
  title: "New Part",
};

export default async function NewPartPage() {
  const categoriesPage = await getCategories();

  return (
    <>
      <PageHeader
        title="New Part"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Parts", href: "/admin/parts" },
          { label: "New Part" },
        ]}
      />

      <PartForm categories={categoriesPage.content} />
    </>
  );
}
