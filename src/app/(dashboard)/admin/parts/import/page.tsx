import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { BulkImportForm } from "../_components/bulk-import-form";

export const metadata: Metadata = {
  title: "Import Parts",
};

export default async function ImportPartsPage() {
  const t = await getTranslations("parts");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("bulkImportPageTitle")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: t("bulkImportPageTitle") },
        ]}
      />

      <BulkImportForm />
    </>
  );
}
