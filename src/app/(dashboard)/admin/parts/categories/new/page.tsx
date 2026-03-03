import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CategoryForm } from "../_components/category-form";

export const metadata: Metadata = {
  title: "New Category",
};

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader
        title="New Category"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Parts", href: "/admin/parts" },
          { label: "Categories", href: "/admin/parts/categories" },
          { label: "New Category" },
        ]}
      />

      <CategoryForm />
    </>
  );
}
