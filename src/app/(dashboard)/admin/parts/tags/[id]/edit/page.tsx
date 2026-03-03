import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { getTagById } from "@/services/tags.server";
import { TagForm } from "../../_components/tag-form";

export const metadata: Metadata = {
  title: "Edit Tag",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditTagPage({ params }: Props) {
  const { id } = await params;
  const tag = await getTagById(id);

  if (!tag) notFound();

  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <>
      <PageHeader
        title={`${tCommon("edit")} — ${tag.name}`}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("parts"), href: "/admin/parts" },
          { label: tNav("tags"), href: "/admin/parts/tags" },
          { label: tag.name },
          { label: tCommon("edit") },
        ]}
      />

      <TagForm tag={tag} />
    </>
  );
}
