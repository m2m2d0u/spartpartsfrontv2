import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { StoreForm } from "../_components/store-form";

export const metadata: Metadata = {
  title: "New Store",
};

export default function NewStorePage() {
  return (
    <>
      <PageHeader
        title="New Store"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Stores", href: "/admin/stores" },
          { label: "New Store" },
        ]}
      />

      <StoreForm />
    </>
  );
}
