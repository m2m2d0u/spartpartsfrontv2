import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { StoreForm } from "../_components/store-form";

export const metadata: Metadata = {
  title: "New Store",
};

export default async function NewStorePage() {
  const t = await getTranslations("stores");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newStore")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stores"), href: "/admin/stores" },
          { label: t("newStore") },
        ]}
      />

      <StoreForm />
    </>
  );
}
