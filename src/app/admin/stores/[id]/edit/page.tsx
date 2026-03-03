import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { getStoreById } from "@/services/stores.service";
import { StoreForm } from "../../_components/store-form";

export const metadata: Metadata = {
  title: "Edit Store",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditStorePage({ params }: Props) {
  const { id } = await params;
  const store = await getStoreById(id);

  if (!store) notFound();

  return (
    <>
      <PageHeader
        title={`Edit — ${store.name}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Stores", href: "/admin/stores" },
          { label: store.name, href: `/admin/stores/${store.id}` },
          { label: "Edit" },
        ]}
      />

      <StoreForm store={store} />
    </>
  );
}
