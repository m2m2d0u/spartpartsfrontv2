import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getStoreById } from "@/services/stores.server";
import { StoreForm } from "../../_components/store-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("stores");
  return { title: t("editStore") };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditStorePage({ params }: Props) {
  const { id } = await params;
  const store = await getStoreById(id);

  if (!store) notFound();

  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${store.name}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stores"), href: "/admin/stores" },
          { label: store.name, href: `/admin/stores/${store.id}` },
          { label: tCommon("edit") },
        ]}
      />

      <StoreForm store={store} />
    </>
  );
}
