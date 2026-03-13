import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { RoleForm } from "../_components/role-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("roles");
  return { title: t("newRole") };
}

export default async function NewRolePage() {
  const t = await getTranslations("roles");
  const tNav = await getTranslations("nav");

  return (
    <>
      <PageHeader
        title={t("newRole")}
        breadcrumbs={[
          { label: tNav("dashboard"), href: "/admin" },
          { label: tNav("roles"), href: "/admin/roles" },
          { label: t("newRole") },
        ]}
      />

      <RoleForm />
    </>
  );
}
