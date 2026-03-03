import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getStoreById } from "@/services/stores.server";
import { getCompanySettings } from "@/services/company-settings.server";
import { StoreOverridesForm } from "./_components/store-overrides-form";

export const metadata: Metadata = {
  title: "Store Settings",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoreSettingsPage({ params }: Props) {
  const { id } = await params;
  const [store, companySettings] = await Promise.all([
    getStoreById(id),
    getCompanySettings(),
  ]);

  if (!store) notFound();

  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={`${tNav("settings")} — ${store.name}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("stores"), href: "/admin/stores" },
          { label: store.name, href: `/admin/stores/${store.id}` },
          { label: tNav("settings") },
        ]}
      />

      <StoreOverridesForm store={store} companySettings={companySettings} />
    </>
  );
}
