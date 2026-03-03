import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getStoreById } from "@/services/stores.service";
import { getCompanySettings } from "@/services/company-settings.service";
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

  return (
    <>
      <PageHeader
        title={`Settings — ${store.name}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Stores", href: "/admin/stores" },
          { label: store.name, href: `/admin/stores/${store.id}` },
          { label: "Settings" },
        ]}
      />

      <StoreOverridesForm store={store} companySettings={companySettings} />
    </>
  );
}
